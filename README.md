# xatlas-wasi

xatlas build with wasi-sdk

## Example

```typescript
import { WasmExports, WasmContext, xatlasMeshDecl, xatlasAtlas, xatlasMesh } from "xatlas-wasi";


const wasm = await WebAssembly.instantiateStreaming(fetch('./xatlas-dbg.wasm'), {
    env: {
        js_log(ptr: number, len: number) {
            if (len < 0) {
                console.error('js_log: error printing log', len);
                return;
            }
            var buf = new Uint8Array((wasm.instance.exports as unknown as WasmExports).memory.buffer);
            console.log(new TextDecoder().decode(buf.subarray(ptr, ptr + len)));
        },
        js_progress(type: number, progress: number, _: never) {
            console.log('js_progress', type, progress);
            return 1;
        }
    },
    // never called
    // you will only need this for xatlas-dbg.wasm
    wasi_snapshot_preview1: {
        fd_close: function(rval) {
            return 0;
        },
        fd_seek: function(rval) {
            return 0;
        },
        fd_write: function(rval) {
            return 0;
        }
    }
});
const exports = wasm.instance.exports as unknown as WasmExports;
const ctx = new WasmContext(exports);

const meshes = [{
    indices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 0, 18, 1, 3, 19, 4, 20, 21, 22, 23, 24, 10, 25, 26, 27, 15, 28, 16],
    normals: [0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, -1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, -1],
    positions: [-1, -1, 1, 1, -1, -1, -1, -1, -1, 1, 1, -1, -0.999999, 1, 1.000001, -1, 1, -0.999999, -1, 1, -0.999999, -1, -1, 1, -1, -1, -1, -0.999999, 1, 1.000001, 1, -1, 1, -1, -1, 1, 1, -1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -0.999999, 1, -1, 1, 1, 1, 1, -1, 1, -0.999999, -0.999999, 1, 1.000001, -1, -1, 1, -0.999999, 1, 1.000001, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, -1, -1]
}];

let atlas = exports.xatlasCreate();
for (let index = 0; index < meshes.length; index++) {
    const mesh   = meshes[index];
    let meshDecl = exports.malloc(xatlasMeshDecl.SIZE + mesh.positions.length * 4 + mesh.normals.length * 4 + mesh.indices.length * 2);
    ctx.reload();
    let positionsPtr = meshDecl + xatlasMeshDecl.SIZE;
    let normalsPtr = positionsPtr + mesh.positions.length * 4;
    let indicesPtr = normalsPtr + mesh.normals.length * 4;
    ctx.writeF32(positionsPtr, mesh.positions);
    ctx.writeF32(normalsPtr, mesh.normals);
    ctx.writeU16(indicesPtr, mesh.indices);
    exports.xatlasMeshDeclInit(meshDecl);
    let meshObj = new xatlasMeshDecl();
    meshObj.read(meshDecl, ctx);
    meshObj.indexData = indicesPtr;
    meshObj.indexFormat = 0;
    meshObj.indexCount = mesh.indices.length;
    meshObj.vertexCount = mesh.positions.length / 3;
    meshObj.vertexPositionData = positionsPtr;
    meshObj.vertexPositionStride = 12;
    meshObj.vertexNormalData = normalsPtr;
    meshObj.vertexNormalStride = 12;
    meshObj.write(meshDecl, ctx);
    let error = exports.xatlasAddMesh(atlas, meshDecl, 1);
    console.log('error', error);
    exports.free(meshDecl);
}
exports.xatlasAddMeshJoin(atlas);
exports.xatlasGenerate(atlas, 0, 0);
// call this before reading data after allocates
ctx.reload();

let atlasObj = new xatlasAtlas();
atlasObj.read(atlas, ctx);
let meshPtr = atlasObj.meshes;
let meshInfo = new xatlasMesh();

for (let index = 0; index < meshes.length; index++) {
    const mesh   = meshes[index];
    meshInfo.read(atlasObj.meshes, ctx);
    console.log(meshInfo);
    let originalIndicesPtr = exports.malloc(meshInfo.vertexCount * 12);
    let uvPtr = originalIndicesPtr + meshInfo.vertexCount * 4;
    exports.copy_uv(atlas, meshPtr, originalIndicesPtr);
    ctx.reload();
    let newIndexData = ctx.readU32(meshInfo.indexArray, meshInfo.indexCount);
    let originalIndexData = ctx.readU32(originalIndicesPtr, meshInfo.vertexCount);
    let uvData = ctx.readF32(uvPtr, meshInfo.vertexCount * 2);
    console.log('newIndexData', newIndexData);
    console.log('originalIndexData', originalIndexData);
    console.log('uvData', uvData);
    let newMesh = {
        indices: [] as ArrayLike<number>,
        positions: [] as ArrayLike<number>,
        normals: [] as ArrayLike<number>,
        uvs: [] as ArrayLike<number>,
    };
    for(var semantics of Object.keys(newMesh)) {
        if (semantics === 'indices' || semantics === 'uvs') continue;
        const attribute = newMesh[semantics] as ArrayLike<number>;
        const elementSize = 3;

        const oldArray = mesh[semantics] as ArrayLike<number>;
        const newArray =  new Float32Array(meshInfo.vertexCount * elementSize);

        for (let i = 0, l = meshInfo.vertexCount; i < l; i++) {
            let originalIndex = originalIndexData[i];
            
            for (let index = 0; index < elementSize; index++) {
                newArray[elementSize * i + index] = oldArray[elementSize * originalIndex + index];
            }
        }

        newMesh[semantics] = newArray;
    }
    newMesh.indices = newIndexData.slice();
    newMesh.uvs = uvData.slice();

    for(var semantics of Object.keys(newMesh)) {
        newMesh[semantics] = Array.from(newMesh[semantics]);
    }
    console.log(newMesh)
    exports.free(originalIndicesPtr);
}
exports.xatlasDestroy(atlas);
```
