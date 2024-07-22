export type ptr<T> = number;
export type bool = boolean;
export type xatlasChartType = number;
export type xatlasIndexFormat = number;
export type xatlasAddMeshError = number;
export type xatlasProgressCategory = number;

export interface WasmExports {
    memory: WebAssembly.Memory;
    xatlasCreate(): ptr<xatlasAtlas>;
    xatlasDestroy(atlas: ptr<xatlasAtlas>): void;
    xatlasAddMesh(atlas: ptr<xatlasAtlas>, meshDecl: ptr<xatlasMeshDecl>, meshCountHint: number): xatlasAddMeshError;
    xatlasAddMeshJoin(atlas: ptr<xatlasAtlas>): void;
    xatlasAddUvMesh(atlas: ptr<xatlasAtlas>, decl: ptr<xatlasUvMeshDecl>): xatlasAddMeshError;
    xatlasComputeCharts(atlas: ptr<xatlasAtlas>, chartOptions: ptr<xatlasChartOptions>): void;
    xatlasPackCharts(atlas: ptr<xatlasAtlas>, packOptions: ptr<xatlasPackOptions>): void;
    xatlasGenerate(atlas: ptr<xatlasAtlas>, chartOptions: ptr<xatlasChartOptions>, packOptions: ptr<xatlasPackOptions>): void;
    xatlasAddMeshErrorString(error: xatlasAddMeshError): ptr<string>;
    xatlasProgressCategoryString(category: xatlasProgressCategory): ptr<string>;
    xatlasMeshDeclInit(meshDecl: ptr<xatlasMeshDecl>): void;
    xatlasUvMeshDeclInit(uvMeshDecl: ptr<xatlasUvMeshDecl>): void;
    xatlasChartOptionsInit(chartOptions: ptr<xatlasChartOptions>): void;
    xatlasPackOptionsInit(packOptions: ptr<xatlasPackOptions>): void;
    malloc(size: number): ptr<void>;
    realloc(ptr: ptr<void>, size: number): ptr<void>;
    free(ptr: ptr<void>): void;
    copy_uv(atlas: ptr<xatlasAtlas>, mesh: ptr<xatlasMesh>, output: ptr<void>): void;
}

export class WasmContext {
    declare memU8: Uint8Array;
    declare memU16: Uint16Array;
    declare memU32: Uint32Array;
    declare memF32: Float32Array;

    constructor(public exports: WasmExports) {
        this.reload();
    }

    reload() {
        this.memU8 = new Uint8Array(this.exports.memory.buffer);
        this.memU16 = new Uint16Array(this.exports.memory.buffer);
        this.memU32 = new Uint32Array(this.exports.memory.buffer);
        this.memF32 = new Float32Array(this.exports.memory.buffer);
    }

    readU8(ptr: ptr<any>, size: number) {
        return this.memU8.subarray(ptr, ptr + size);
    }

    writeU8(ptr: ptr<any>, arr: ArrayLike<number>) {
        return this.memU8.set(arr, ptr);
    }
    readU16(ptr: ptr<any>, size: number) {
        return this.memU16.subarray(ptr >> 1, (ptr >> 1) + size);
    }

    writeU16(ptr: ptr<any>, arr: ArrayLike<number>) {
        this.memU16.set(arr, ptr >> 1);
    }

    readU32(ptr: ptr<any>, size: number) {
        return this.memU32.subarray(ptr >> 2, (ptr >> 2) + size);
    }

    writeU32(ptr: ptr<any>, arr: ArrayLike<number>) {
        this.memU32.set(arr, ptr >> 2);
    }

    readF32(ptr: ptr<any>, size: number) {
        return this.memF32.subarray(ptr >> 2, (ptr >> 2) + size);
    }

    writeF32(ptr: ptr<any>, arr: ArrayLike<number>) {
        this.memF32.set(arr, ptr >> 2);
    }
    // get memU8(): Uint8Array {
    //     let arr = this._u8;
    //     if (arr.buffer?.byteLength) {
    //         return arr;
    //     }
    //     arr = this._u8 = new Uint8Array(this.exports.memory.buffer);
    //     return arr;
    // }
    // get memU16(): Uint16Array {
    //     let arr = this._u16;
    //     if (arr.buffer?.byteLength) {
    //         return arr;
    //     }
    //     arr = this._u16 = new Uint16Array(this.exports.memory.buffer);
    //     return arr;
    // }
    // get memU32(): Uint32Array {
    //     let arr = this._u32;
    //     if (arr.buffer?.byteLength) {
    //         return arr;
    //     }
    //     arr = this._u32 = new Uint32Array(this.exports.memory.buffer);
    //     return arr;
    // }
    // get memF32(): Float32Array {
    //     let arr = this._f32;
    //     if (arr.buffer?.byteLength) {
    //         return arr;
    //     }
    //     arr = this._f32 = new Float32Array(this.exports.memory.buffer);
    //     return arr;
    // }
}

export class xatlasChart {
    static readonly SIZE = 20;
    declare faceArray: ptr<number>;
    declare atlasIndex: number;
    declare faceCount: number;
    declare type: xatlasChartType;
    declare material: number;

    read(ptr: ptr<any>, ctx: WasmContext) {
        const mem = ctx.memU32;
        let offset = ptr / 4;
        this.faceArray = mem[offset];
        this.atlasIndex = mem[offset + 1];
        this.faceCount = mem[offset + 2];
        this.type = mem[offset + 3];
        this.material = mem[offset + 4];
    }

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

export class xatlasVertex {
    static readonly SIZE = 20;
    declare atlasIndex: number;
    declare chartIndex: number;
    declare uv: [number, number];
    declare xref: number;

    read(ptr: ptr<any>, ctx: WasmContext) {
        const memI32 = ctx.memU32;
        const memF32 = ctx.memF32;
        let offset = ptr / 4;
        this.atlasIndex = memI32[offset];
        this.chartIndex = memI32[offset + 1];
        this.uv = [memF32[offset + 2], memF32[offset + 3]];
        this.xref = memI32[offset + 4];
    }

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

export class xatlasMesh {
    static readonly SIZE = 24;
    declare chartArray: ptr<xatlasChart>;
    declare indexArray: ptr<number>;
    declare vertexArray: ptr<xatlasVertex>;
    declare chartCount: number;
    declare indexCount: number;
    declare vertexCount: number;

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
     * Warn: do not allocate this directly, real size larger than this
     */
    static readonly SIZE = 36;
    declare image: ptr<number>;
    declare meshes: ptr<xatlasMesh>;
    declare utilization: ptr<number>;
    declare width: number;
    declare height: number;
    declare atlasCount: number;
    declare chartCount: number;
    declare meshCount: number;
    declare texelsPerUnit: number;

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
    static readonly SIZE = 64;
    declare vertexPositionData: ptr<any>;
    declare vertexNormalData: ptr<any>;
    declare vertexUvData: ptr<any>;
    declare indexData: ptr<any>;
    declare faceIgnoreData: ptr<bool>;
    declare faceMaterialData: ptr<number>;
    declare faceVertexCount: ptr<number>;
    declare vertexCount: number;
    declare vertexPositionStride: number;
    declare vertexNormalStride: number;
    declare vertexUvStride: number;
    declare indexCount: number;
    declare indexOffset: number;
    declare faceCount: number;
    declare indexFormat: xatlasIndexFormat;
    declare epsilon: number;

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
    static readonly SIZE = 32;
    declare vertexUvData: ptr<any>;
    declare indexData: ptr<any>;
    declare faceMaterialData: ptr<number>;
    declare vertexCount: number;
    declare vertexStride: number;
    declare indexCount: number;
    declare indexOffset: number;
    declare indexFormat: xatlasIndexFormat;

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
    static readonly SIZE = 44;
    declare paramFunc: ptr<any>;
    declare maxChartArea: number;
    declare maxBoundaryLength: number;
    declare normalDeviationWeight: number;
    declare roundnessWeight: number;
    declare straightnessWeight: number;
    declare normalSeamWeight: number;
    declare textureSeamWeight: number;
    declare maxCost: number;
    declare maxIterations: number;
    declare useInputMeshUvs: bool;
    declare fixWinding: bool;

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
    static readonly SIZE = 24;
    declare maxChartSize: number;
    declare padding: number;
    declare texelsPerUnit: number;
    declare resolution: number;
    declare bilinear: bool;
    declare blockAlign: bool;
    declare bruteForce: bool;
    declare createImage: bool;
    declare rotateChartsToAxis: bool;
    declare rotateCharts: bool;

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
