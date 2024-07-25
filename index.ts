export type ptr<T> = number;
export type bool = boolean;

/**
 * Enum for chart types.
 *
 * @enum {number}
 */
export const enum xatlasChartType {
    /**
     * Planar chart type.
     */
    XATLAS_CHART_TYPE_PLANAR = 0,
    /**
     * Orthogonal chart type.
     */
    XATLAS_CHART_TYPE_ORTHO = 1,
    /**
     * Least squares conformal map chart type.
     */
    XATLAS_CHART_TYPE_LSCM = 2,
    /**
     * Piecewise chart type.
     */
    XATLAS_CHART_TYPE_PIECEWISE = 3,
    /**
     * Invalid chart type.
     */
    XATLAS_CHART_TYPE_INVALID = 4,
}

/**
 * Enum for index formats.
 *
 * @enum {number}
 */
export const enum xatlasIndexFormat {
    /**
     * 16-bit unsigned integer format.
     */
    XATLAS_INDEX_FORMAT_UINT16 = 0,
    /**
     * 32-bit unsigned integer format.
     */
    XATLAS_INDEX_FORMAT_UINT32 = 1,
}

/**
 * Enum for add mesh errors.
 *
 * @enum {number}
 */
export const enum xatlasAddMeshError {
    /**
     * No error, operation successful.
     */
    XATLAS_ADD_MESH_ERROR_SUCCESS = 0,
    /**
     * Unspecified error.
     */
    XATLAS_ADD_MESH_ERROR_ERROR = 1,
    /**
     * An index is >= MeshDecl vertexCount.
     */
    XATLAS_ADD_MESH_ERROR_INDEXOUTOFRANGE = 2,
    /**
     * Must be >= 3.
     */
    XATLAS_ADD_MESH_ERROR_INVALIDFACEVERTEXCOUNT = 3,
    /**
     * Not evenly divisible by 3 - expecting triangles.
     */
    XATLAS_ADD_MESH_ERROR_INVALIDINDEXCOUNT = 4,
}

/**
 * Enum for progress categories.
 *
 * @enum {number}
 */
export const enum xatlasProgressCategory {
    /**
     * Adding mesh progress.
     */
    XATLAS_PROGRESS_CATEGORY_ADDMESH = 0,
    /**
     * Computing charts progress.
     */
    XATLAS_PROGRESS_CATEGORY_COMPUTECHARTS = 1,
    /**
     * Packing charts progress.
     */
    XATLAS_PROGRESS_CATEGORY_PACKCHARTS = 2,
    /**
     * Building output meshes progress.
     */
    XATLAS_PROGRESS_CATEGORY_BUILDOUTPUTMESHES = 3,
}

/**
 * Interface for WebAssembly exports of xatlas.
 */
export interface WasmExports {
    memory: WebAssembly.Memory;

    /**
     * Create an empty atlas.
     * @returns Pointer to the created xatlasAtlas.
     */
    xatlasCreate(): ptr<xatlasAtlas>;

    /**
     * Destroys the given atlas.
     * @param atlas - Pointer to the xatlasAtlas to destroy.
     */
    xatlasDestroy(atlas: ptr<xatlasAtlas>): void;

    /**
     * Add a mesh to the atlas.
     * MeshDecl data is copied, so it can be freed after AddMesh returns.
     * @param atlas - Pointer to the xatlasAtlas.
     * @param meshDecl - Pointer to the xatlasMeshDecl.
     * @param meshCountHint - Hint for the number of meshes.
     * @returns Error code of type xatlasAddMeshError.
     */
    xatlasAddMesh(atlas: ptr<xatlasAtlas>, meshDecl: ptr<xatlasMeshDecl>, meshCountHint: number): xatlasAddMeshError;

    /**
     * Wait for AddMesh async processing to finish. ComputeCharts / Generate call this internally.
     * Only for debug build since there is no threads
     */
    xatlasAddMeshJoin?(atlas: ptr<xatlasAtlas>): void;

    /**
     * Adds a UV mesh to the atlas.
     * @param atlas - Pointer to the xatlasAtlas.
     * @param decl - Pointer to the xatlasUvMeshDecl.
     * @returns Error code of type xatlasAddMeshError.
     */
    xatlasAddUvMesh(atlas: ptr<xatlasAtlas>, decl: ptr<xatlasUvMeshDecl>): xatlasAddMeshError;

    /**
     * Computes the charts for the given atlas.
     * @param atlas - Pointer to the xatlasAtlas.
     * @param chartOptions - Pointer to the xatlasChartOptions.
     */
    xatlasComputeCharts(atlas: ptr<xatlasAtlas>, chartOptions: ptr<xatlasChartOptions>): void;

    /**
     * Call after ComputeCharts. Can be called multiple times to re-pack charts with different options.
     * @param atlas - Pointer to the xatlasAtlas.
     * @param packOptions - Pointer to the xatlasPackOptions.
     */
    xatlasPackCharts(atlas: ptr<xatlasAtlas>, packOptions: ptr<xatlasPackOptions>): void;

    /**
     * Equivalent to calling ComputeCharts and PackCharts in sequence.
     * Can be called multiple times to regenerate with different options.
     * @param atlas - Pointer to the xatlasAtlas.
     * @param chartOptions - Pointer to the xatlasChartOptions.
     * @param packOptions - Pointer to the xatlasPackOptions.
     */
    xatlasGenerate(atlas: ptr<xatlasAtlas>, chartOptions: ptr<xatlasChartOptions>, packOptions: ptr<xatlasPackOptions>): void;

    // Helper functions for error messages. Only for debug build
    xatlasAddMeshErrorString?(error: xatlasAddMeshError): ptr<string>;

    // Helper functions for error messages. Only for debug build
    xatlasProgressCategoryString?(category: xatlasProgressCategory): ptr<string>;

    /**
     * Initializes the mesh declaration.
     * @param meshDecl - Pointer to the xatlasMeshDecl to initialize.
     */
    xatlasMeshDeclInit(meshDecl: ptr<xatlasMeshDecl>): void;

    /**
     * Initializes the UV mesh declaration.
     * @param uvMeshDecl - Pointer to the xatlasUvMeshDecl to initialize.
     */
    xatlasUvMeshDeclInit(uvMeshDecl: ptr<xatlasUvMeshDecl>): void;

    /**
     * Initializes the chart options.
     * @param chartOptions - Pointer to the xatlasChartOptions to initialize.
     */
    xatlasChartOptionsInit(chartOptions: ptr<xatlasChartOptions>): void;

    /**
     * Initializes the pack options.
     * @param packOptions - Pointer to the xatlasPackOptions to initialize.
     */
    xatlasPackOptionsInit(packOptions: ptr<xatlasPackOptions>): void;

    /**
     * Allocates memory of the given size.
     * @param size - Size of memory to allocate.
     * @returns Pointer to the allocated memory.
     */
    malloc(size: number): ptr<void>;

    /**
     * Reallocates memory at the given pointer to the new size.
     * @param ptr - Pointer to the existing memory.
     * @param size - New size of memory.
     * @returns Pointer to the reallocated memory.
     */
    realloc(ptr: ptr<void>, size: number): ptr<void>;

    /**
     * Frees the memory at the given pointer.
     * @param ptr - Pointer to the memory to free.
     */
    free(ptr: ptr<void>): void;

    /**
     * Copies original indices and normalizes UV.
     * @param atlas - Pointer to the xatlasAtlas.
     * @param mesh - Pointer to the xatlasMesh.
     * @param output - Pointer to the output buffer.
     */
    copy_uv(atlas: ptr<xatlasAtlas>, mesh: ptr<xatlasMesh>, output: ptr<void>): void;
}

/**
 * Class for managing WebAssembly context and memory operations.
 */
export class WasmContext {
    /**
     * Uint8Array view of the WebAssembly memory.
     */
    declare memU8: Uint8Array;

    /**
     * Uint16Array view of the WebAssembly memory.
     */
    declare memU16: Uint16Array;

    /**
     * Uint32Array view of the WebAssembly memory.
     */
    declare memU32: Uint32Array;

    /**
     * Float32Array view of the WebAssembly memory.
     */
    declare memF32: Float32Array;

    /**
     * Creates an instance of WasmContext.
     * @param exports - The WebAssembly exports object.
     */
    constructor(public exports: WasmExports) {
        this.reload();
    }

    /**
     * Reloads the memory views.
     * Call this method manually in case of memory growth.
     */
    reload() {
        this.memU8 = new Uint8Array(this.exports.memory.buffer);
        this.memU16 = new Uint16Array(this.exports.memory.buffer);
        this.memU32 = new Uint32Array(this.exports.memory.buffer);
        this.memF32 = new Float32Array(this.exports.memory.buffer);
    }

    /**
     * Reads a portion of the WebAssembly memory as a Uint8Array.
     * @param ptr - Pointer to the start of the memory.
     * @param size - Number of bytes to read.
     * @returns The portion of memory as a Uint8Array.
     */
    readU8(ptr: ptr<any>, size: number) {
        return this.memU8.subarray(ptr, ptr + size);
    }

    /**
     * Writes an array of Uint8 values to the WebAssembly memory.
     * @param ptr - Pointer to the start of the memory.
     * @param arr - Array of Uint8 values to write.
     */
    writeU8(ptr: ptr<any>, arr: ArrayLike<number>) {
        this.memU8.set(arr, ptr);
    }

    /**
     * Reads a portion of the WebAssembly memory as a Uint16Array.
     * @param ptr - Pointer to the start of the memory.
     * @param size - Number of elements to read.
     * @returns The portion of memory as a Uint16Array.
     */
    readU16(ptr: ptr<any>, size: number) {
        return this.memU16.subarray(ptr >> 1, (ptr >> 1) + size);
    }

    /**
     * Writes an array of Uint16 values to the WebAssembly memory.
     * @param ptr - Pointer to the start of the memory.
     * @param arr - Array of Uint16 values to write.
     */
    writeU16(ptr: ptr<any>, arr: ArrayLike<number>) {
        this.memU16.set(arr, ptr >> 1);
    }

    /**
     * Reads a portion of the WebAssembly memory as a Uint32Array.
     * @param ptr - Pointer to the start of the memory.
     * @param size - Number of elements to read.
     * @returns The portion of memory as a Uint32Array.
     */
    readU32(ptr: ptr<any>, size: number) {
        return this.memU32.subarray(ptr >> 2, (ptr >> 2) + size);
    }

    /**
     * Writes an array of Uint32 values to the WebAssembly memory.
     * @param ptr - Pointer to the start of the memory.
     * @param arr - Array of Uint32 values to write.
     */
    writeU32(ptr: ptr<any>, arr: ArrayLike<number>) {
        this.memU32.set(arr, ptr >> 2);
    }

    /**
     * Reads a portion of the WebAssembly memory as a Float32Array.
     * @param ptr - Pointer to the start of the memory.
     * @param size - Number of elements to read.
     * @returns The portion of memory as a Float32Array.
     */
    readF32(ptr: ptr<any>, size: number) {
        return this.memF32.subarray(ptr >> 2, (ptr >> 2) + size);
    }

    /**
     * Writes an array of Float32 values to the WebAssembly memory.
     * @param ptr - Pointer to the start of the memory.
     * @param arr - Array of Float32 values to write.
     */
    writeF32(ptr: ptr<any>, arr: ArrayLike<number>) {
        this.memF32.set(arr, ptr >> 2);
    }
}

/**
 * A group of connected faces, belonging to a single atlas.
 */
export class xatlasChart {
    /**
     * Size of the `xatlasChart` structure in bytes.
     */
    static readonly SIZE = 20;

    /**
     * Pointer to an array of face indices.
     */
    declare faceArray: ptr<number>;

    /**
     * Sub-atlas index.
     */
    declare atlasIndex: number;

    /**
     * Number of faces in this chart.
     */
    declare faceCount: number;

    /**
     * Type of chart.
     */
    declare type: xatlasChartType;

    /**
     * Material index for the faces in this chart.
     */
    declare material: number;

    /**
     * Reads the `xatlasChart` data from the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasChart` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    read(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        let offset = ptr / 4;
        this.faceArray = mem[offset];
        this.atlasIndex = mem[offset + 1];
        this.faceCount = mem[offset + 2];
        this.type = mem[offset + 3];
        this.material = mem[offset + 4];
    }

    /**
     * Writes the `xatlasChart` data to the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasChart` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    write(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        let offset = ptr / 4;
        mem[offset] = this.faceArray;
        mem[offset + 1] = this.atlasIndex;
        mem[offset + 2] = this.faceCount;
        mem[offset + 3] = this.type;
        mem[offset + 4] = this.material;
    }
}

/**
 * Output vertex.
 */
export class xatlasVertex {
    /**
     * Size of the `xatlasVertex` structure in bytes.
     */
    static readonly SIZE = 20;

    /**
     * Sub-atlas index. -1 if the vertex doesn't exist in any atlas.
     */
    declare atlasIndex: number;

    /**
     * -1 if the vertex doesn't exist in any chart.
     */
    declare chartIndex: number;

    /**
     * Not normalized - values are in Atlas width and height range.
     */
    declare uv: [number, number];

    /**
     * Index of input vertex from which this output vertex originated.
     */
    declare xref: number;

    /**
     * Reads the `xatlasVertex` data from the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasVertex` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    read(ptr: ptr<any>, ctx: WasmContext) {
        const memI32 = ctx.memU32;
        const memF32 = ctx.memF32;
        let offset = ptr / 4;
        this.atlasIndex = memI32[offset];
        this.chartIndex = memI32[offset + 1];
        this.uv = [memF32[offset + 2], memF32[offset + 3]];
        this.xref = memI32[offset + 4];
    }

    /**
     * Writes the `xatlasVertex` data to the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasVertex` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    write(ptr: ptr<any>, ctx: WasmContext) {
        const memI32 = ctx.memU32;
        const memF32 = ctx.memF32;
        let offset = ptr / 4;
        memI32[offset] = this.atlasIndex;
        memI32[offset + 1] = this.chartIndex;
        memF32[offset + 2] = this.uv[0];
        memF32[offset + 3] = this.uv[1];
        memI32[offset + 4] = this.xref;
    }
}

/**
 * Output mesh.
 */
export class xatlasMesh {
    /**
     * Size of the `xatlasMesh` structure in bytes.
     */
    static readonly SIZE = 24;

    /**
     * Pointer to an array of `xatlasChart` structures.
     */
    declare chartArray: ptr<xatlasChart>;

    /**
     * Pointer to an array of indices.
     */
    declare indexArray: ptr<number>;

    /**
     * Pointer to an array of `xatlasVertex` structures.
     */
    declare vertexArray: ptr<xatlasVertex>;

    /**
     * Number of charts in this mesh.
     */
    declare chartCount: number;

    /**
     * Number of indices in this mesh.
     */
    declare indexCount: number;

    /**
     * Number of vertices in this mesh.
     */
    declare vertexCount: number;

    /**
     * Reads the `xatlasMesh` data from the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasMesh` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    read(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        let offset = ptr / 4;
        this.chartArray = mem[offset];
        this.indexArray = mem[offset + 1];
        this.vertexArray = mem[offset + 2];
        this.chartCount = mem[offset + 3];
        this.indexCount = mem[offset + 4];
        this.vertexCount = mem[offset + 5];
    }

    /**
     * Writes the `xatlasMesh` data to the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasMesh` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    write(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        let offset = ptr / 4;
        mem[offset] = this.chartArray;
        mem[offset + 1] = this.indexArray;
        mem[offset + 2] = this.vertexArray;
        mem[offset + 3] = this.chartCount;
        mem[offset + 4] = this.indexCount;
        mem[offset + 5] = this.vertexCount;
    }
}

export class xatlasAtlas {
    /**
     * Warning: do not allocate this directly, real size larger than this.
     */
    static readonly SIZE = 36;

    /**
     * Pointer to an array representing the image.
     */
    declare image: ptr<number>;

    /**
     * The output meshes, corresponding to each AddMesh call.
     */
    declare meshes: ptr<xatlasMesh>;

    /**
     * Normalized atlas texel utilization array.
     * E.g. a value of 0.8 means 20% empty space. atlasCount in length.
     */
    declare utilization: ptr<number>;

    /**
     * Atlas width in texels.
     */
    declare width: number;

    /**
     * Atlas height in texels.
     */
    declare height: number;

    /**
     * Number of sub-atlases. Equal to 0 unless PackOptions resolution is changed from default (0).
     */
    declare atlasCount: number;

    /**
     * Total number of charts in all meshes.
     */
    declare chartCount: number;

    /**
     * Number of output meshes. Equal to the number of times AddMesh was called.
     */
    declare meshCount: number;

    /**
     * Equal to PackOptions texelsPerUnit if texelsPerUnit > 0,
     * otherwise an estimated value to match PackOptions resolution.
     */
    declare texelsPerUnit: number;

    /**
     * Reads the `xatlasAtlas` data from the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasAtlas` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    read(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        const memF32 = ctx.memF32;
        let offset = ptr / 4;
        this.image = mem[offset];
        this.meshes = mem[offset + 1];
        this.utilization = mem[offset + 2];
        this.width = mem[offset + 3];
        this.height = mem[offset + 4];
        this.atlasCount = mem[offset + 5];
        this.chartCount = mem[offset + 6];
        this.meshCount = mem[offset + 7];
        this.texelsPerUnit = memF32[offset + 8];
    }

    /**
     * Writes the `xatlasAtlas` data to the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasAtlas` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    write(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        const memF32 = ctx.memF32;
        let offset = ptr / 4;
        mem[offset] = this.image;
        mem[offset + 1] = this.meshes;
        mem[offset + 2] = this.utilization;
        mem[offset + 3] = this.width;
        mem[offset + 4] = this.height;
        mem[offset + 5] = this.atlasCount;
        mem[offset + 6] = this.chartCount;
        mem[offset + 7] = this.meshCount;
        memF32[offset + 8] = this.texelsPerUnit;
    }
}

export class xatlasMeshDecl {
    /**
     * Size of the `xatlasMeshDecl` structure in bytes.
     */
    static readonly SIZE = 64;

    /**
     * Pointer to vertex position data.
     */
    declare vertexPositionData: ptr<any>;

    /**
     * Pointer to vertex normal data.
     * optional
     */
    declare vertexNormalData: ptr<any>;

    /**
     * Pointer to vertex UV data.
     * optional. The input UVs are provided as a hint to the chart generator.
     */
    declare vertexUvData: ptr<any>;

    /**
     * Pointer to index data.
     * optional
     */
    declare indexData: ptr<any>;

    /**
     * Optional. Must be faceCount in length.
     * Don't atlas faces set to true.
     * Ignored faces still exist in the output meshes,
     * Vertex uv is set to (0, 0) and Vertex atlasIndex to -1.
     */
    declare faceIgnoreData: ptr<bool>;

    /**
     * Optional. Must be faceCount in length.
     * Only faces with the same material will be assigned to the same chart.
     */
    declare faceMaterialData: ptr<number>;

    /**
     * Optional. Must be faceCount in length.
     * Polygon / n-gon support. Faces are assumed to be triangles if this is null.
     */
    declare faceVertexCount: ptr<number>;

    /**
     * Number of vertices.
     */
    declare vertexCount: number;

    /**
     * Stride of vertex position data.
     */
    declare vertexPositionStride: number;

    /**
     * Stride of vertex normal data.
     * optional
     */
    declare vertexNormalStride: number;

    /**
     * Stride of vertex UV data.
     * optional
     */
    declare vertexUvStride: number;

    /**
     * Number of indices.
     */
    declare indexCount: number;

    /**
     * Offset of indices.
     * optional. Add this offset to all indices.
     */
    declare indexOffset: number;

    /**
     * Number of faces.
     * Optional if faceVertexCount is null. Otherwise assumed to be indexCount / 3.
     */
    declare faceCount: number;

    /**
     * Format of the indices.
     */
    declare indexFormat: xatlasIndexFormat;

    /**
     * Vertex positions within epsilon distance of each other are considered colocal.
     */
    declare epsilon: number;

    /**
     * Reads the `xatlasMeshDecl` data from the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasMeshDecl` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    read(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        const memF32 = ctx.memF32;
        let offset = ptr / 4;
        this.vertexPositionData = mem[offset];
        this.vertexNormalData = mem[offset + 1];
        this.vertexUvData = mem[offset + 2];
        this.indexData = mem[offset + 3];
        this.faceIgnoreData = mem[offset + 4];
        this.faceMaterialData = mem[offset + 5];
        this.faceVertexCount = mem[offset + 6];
        this.vertexCount = mem[offset + 7];
        this.vertexPositionStride = mem[offset + 8];
        this.vertexNormalStride = mem[offset + 9];
        this.vertexUvStride = mem[offset + 10];
        this.indexCount = mem[offset + 11];
        this.indexOffset = mem[offset + 12];
        this.faceCount = mem[offset + 13];
        this.indexFormat = mem[offset + 14] as xatlasIndexFormat;
        this.epsilon = memF32[offset + 15];
    }

    /**
     * Writes the `xatlasMeshDecl` data to the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasMeshDecl` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    write(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        const memF32 = ctx.memF32;
        let offset = ptr / 4;
        mem[offset] = this.vertexPositionData;
        mem[offset + 1] = this.vertexNormalData;
        mem[offset + 2] = this.vertexUvData;
        mem[offset + 3] = this.indexData;
        mem[offset + 4] = this.faceIgnoreData;
        mem[offset + 5] = this.faceMaterialData;
        mem[offset + 6] = this.faceVertexCount;
        mem[offset + 7] = this.vertexCount;
        mem[offset + 8] = this.vertexPositionStride;
        mem[offset + 9] = this.vertexNormalStride;
        mem[offset + 10] = this.vertexUvStride;
        mem[offset + 11] = this.indexCount;
        mem[offset + 12] = this.indexOffset;
        mem[offset + 13] = this.faceCount;
        mem[offset + 14] = this.indexFormat;
        memF32[offset + 15] = this.epsilon;
    }
}

export class xatlasUvMeshDecl {
    /**
     * Size of the `xatlasUvMeshDecl` structure in bytes.
     */
    static readonly SIZE = 32;

    /**
     * Pointer to vertex UV data.
     */
    declare vertexUvData: ptr<any>;

    /**
     * Pointer to index data.
     * optional
     */
    declare indexData: ptr<any>;

    /**
     * Optional. Overlapping UVs should be assigned a different material.
     * Must be indexCount / 3 in length.
     */
    declare faceMaterialData: ptr<number>;

    /**
     * Number of vertices.
     */
    declare vertexCount: number;

    /**
     * Stride of vertex data.
     */
    declare vertexStride: number;

    /**
     * Number of indices.
     */
    declare indexCount: number;

    /**
     * optional. Add this offset to all indices.
     */
    declare indexOffset: number;

    /**
     * Format of the indices.
     */
    declare indexFormat: xatlasIndexFormat;

    /**
     * Reads the `xatlasUvMeshDecl` data from the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasUvMeshDecl` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    read(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        let offset = ptr / 4;
        this.vertexUvData = mem[offset];
        this.indexData = mem[offset + 1];
        this.faceMaterialData = mem[offset + 2];
        this.vertexCount = mem[offset + 3];
        this.vertexStride = mem[offset + 4];
        this.indexCount = mem[offset + 5];
        this.indexOffset = mem[offset + 6];
        this.indexFormat = mem[offset + 7] as xatlasIndexFormat;
    }

    /**
     * Writes the `xatlasUvMeshDecl` data to the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasUvMeshDecl` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    write(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        let offset = ptr / 4;
        mem[offset] = this.vertexUvData;
        mem[offset + 1] = this.indexData;
        mem[offset + 2] = this.faceMaterialData;
        mem[offset + 3] = this.vertexCount;
        mem[offset + 4] = this.vertexStride;
        mem[offset + 5] = this.indexCount;
        mem[offset + 6] = this.indexOffset;
        mem[offset + 7] = this.indexFormat;
    }
}

export class xatlasChartOptions {
    /**
     * Size of the `xatlasChartOptions` structure in bytes.
     */
    static readonly SIZE = 44;

    /**
     * Pointer to parameter function.
     * You should always use `0` (NULL) for this.
     */
    declare paramFunc: ptr<any>;

    /**
     * Don't grow charts to be larger than this. 0 means no limit.
     */
    declare maxChartArea: number;

    /**
     * Don't grow charts to have a longer boundary than this. 0 means no limit.
     */
    declare maxBoundaryLength: number;

    /**
     * Weights determine chart growth. Higher weights mean higher cost for that metric.
     * Angle between face and average chart normal.
     */
    declare normalDeviationWeight: number;

    /**
     * Weight for roundness.
     */
    declare roundnessWeight: number;

    /**
     * Weight for straightness.
     */
    declare straightnessWeight: number;

    /**
     * If > 1000, normal seams are fully respected.
     */
    declare normalSeamWeight: number;

    /**
     * Weight for texture seams.
     */
    declare textureSeamWeight: number;

    /**
     * If total of all metrics * weights > maxCost, don't grow chart.
     * Lower values result in more charts.
     */
    declare maxCost: number;

    /**
     * Number of iterations of the chart growing and seeding phases.
     * Higher values result in better charts.
     */
    declare maxIterations: number;

    /**
     * Use MeshDecl::vertexUvData for charts.
     */
    declare useInputMeshUvs: bool;

    /**
     * Enforce consistent texture coordinate winding.
     */
    declare fixWinding: bool;

    /**
     * Reads the `xatlasChartOptions` data from the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasChartOptions` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    read(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        const memF32 = ctx.memF32;
        const memU8 = ctx.memU8;
        let offset = ptr / 4;
        this.paramFunc = mem[offset];
        this.maxChartArea = memF32[offset + 1];
        this.maxBoundaryLength = memF32[offset + 2];
        this.normalDeviationWeight = memF32[offset + 3];
        this.roundnessWeight = memF32[offset + 4];
        this.straightnessWeight = memF32[offset + 5];
        this.normalSeamWeight = memF32[offset + 6];
        this.textureSeamWeight = memF32[offset + 7];
        this.maxCost = memF32[offset + 8];
        this.maxIterations = mem[offset + 9];
        this.useInputMeshUvs = !!memU8[ptr + 40];
        this.fixWinding = !!memU8[ptr + 41];
    }

    /**
     * Writes the `xatlasChartOptions` data to the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasChartOptions` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    write(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        const memF32 = ctx.memF32;
        const memU8 = ctx.memU8;
        let offset = ptr / 4;
        mem[offset] = this.paramFunc;
        memF32[offset + 1] = this.maxChartArea;
        memF32[offset + 2] = this.maxBoundaryLength;
        memF32[offset + 3] = this.normalDeviationWeight;
        memF32[offset + 4] = this.roundnessWeight;
        memF32[offset + 5] = this.straightnessWeight;
        memF32[offset + 6] = this.normalSeamWeight;
        memF32[offset + 7] = this.textureSeamWeight;
        memF32[offset + 8] = this.maxCost;
        mem[offset + 9] = this.maxIterations;
        memU8[ptr + 40] = +this.useInputMeshUvs;
        memU8[ptr + 41] = +this.fixWinding;
    }
}

export class xatlasPackOptions {
    /**
     * Size of the `xatlasPackOptions` structure in bytes.
     */
    static readonly SIZE = 24;

    /**
     * Charts larger than this will be scaled down. 0 means no limit.
     */
    declare maxChartSize: number;

    /**
     * Number of pixels to pad charts with.
     */
    declare padding: number;

    /**
     * Unit to texel scale.
     * e.g. a 1x1 quad with texelsPerUnit of 32 will take up approximately 32x32 texels in the atlas.
     * If 0, an estimated value will be calculated to approximately match the given resolution.
     * If resolution is also 0, the estimated value will approximately match a 1024x1024 atlas.
     */
    declare texelsPerUnit: number;

    /**
     * If 0, generate a single atlas with texelsPerUnit determining the final resolution.
     * If not 0, and texelsPerUnit is not 0, generate one or more atlases with that exact resolution.
     * If not 0, and texelsPerUnit is 0, texelsPerUnit is estimated to approximately match the resolution.
     */
    declare resolution: number;

    /**
     * Leave space around charts for texels that would be sampled by bilinear filtering.
     */
    declare bilinear: bool;

    /**
     * Align charts to 4x4 blocks.
     * Also improves packing speed, since there are fewer possible chart locations to consider.
     */
    declare blockAlign: bool;

    /**
     * Slower, but gives the best result. If false, use random chart placement.
     */
    declare bruteForce: bool;

    /**
     * Create Atlas::image
     */
    declare createImage: bool;

    /**
     * Rotate charts to the axis of their convex hull.
     */
    declare rotateChartsToAxis: bool;

    /**
     * Rotate charts to improve packing.
     */
    declare rotateCharts: bool;

    /**
     * Reads the `xatlasPackOptions` data from the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasPackOptions` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    read(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        const memF32 = ctx.memF32;
        const memU8 = ctx.memU8;
        let offset = ptr / 4;
        this.maxChartSize = mem[offset];
        this.padding = mem[offset + 1];
        this.texelsPerUnit = memF32[offset + 2];
        this.resolution = mem[offset + 3];
        this.bilinear = !!memU8[ptr + 16];
        this.blockAlign = !!memU8[ptr + 17];
        this.bruteForce = !!memU8[ptr + 18];
        this.createImage = !!memU8[ptr + 19];
        this.rotateChartsToAxis = !!memU8[ptr + 20];
        this.rotateCharts = !!memU8[ptr + 21];
    }

    /**
     * Writes the `xatlasPackOptions` data to the WebAssembly memory.
     * @param ptr - Pointer to the `xatlasPackOptions` structure in the WebAssembly memory.
     * @param ctx - The `WasmContext` instance providing access to the WebAssembly memory.
     */
    write(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        const memF32 = ctx.memF32;
        const memU8 = ctx.memU8;
        let offset = ptr / 4;
        mem[offset] = this.maxChartSize;
        mem[offset + 1] = this.padding;
        memF32[offset + 2] = this.texelsPerUnit;
        mem[offset + 3] = this.resolution;
        memU8[ptr + 16] = +this.bilinear;
        memU8[ptr + 17] = +this.blockAlign;
        memU8[ptr + 18] = +this.bruteForce;
        memU8[ptr + 19] = +this.createImage;
        memU8[ptr + 20] = +this.rotateChartsToAxis;
        memU8[ptr + 21] = +this.rotateCharts;
    }
}
