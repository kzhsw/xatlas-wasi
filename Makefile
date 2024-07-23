# Variables for paths
WASI_SDK_PATH = ~/wasi-sdk-22.0/bin
BINARYEN_PATH = ~/binaryen-version_112/bin

# Variables for flags
C_FLAGS = -DJS_PROGRESS=1 -DXA_DEBUG=0 -DXA_MULTITHREADED=0 -DXATLAS_C_API=1 -mnontrapping-fptoint \
	-msign-ext -mbulk-memory -flto=full -ffast-math -ffp-contract=fast -fomit-frame-pointer \
	-Wextra -Wall -DNDEBUG -Wextra -flto -fno-builtin -ffreestanding -fno-ident -nostartfiles
LD_FLAGS = -Wl,--no-export-dynamic,--compress-relocations,--Bstatic \
	-Wl,--strip-debug,--gc-sections,--no-entry,--export-dynamic,--initial-memory=131072 \
	-Wl,--export=xatlasCreate,--export=xatlasDestroy,--export=xatlasAddMesh,--export=xatlasAddUvMesh \
	-Wl,--export=xatlasComputeCharts,--export=xatlasPackCharts,--export=xatlasGenerate,--export=xatlasMeshDeclInit \
	-Wl,--export=xatlasUvMeshDeclInit,--export=xatlasChartOptionsInit,--export=xatlasPackOptionsInit \
    -Wl,--export=malloc,--export=realloc,--export=free,--export=copy_uv

# Source files
SRC_FILES = copy_uv.c xatlas/source/xatlas/xatlas.cpp

# Targets
all: xatlas-dbg.wasm xatlas-opt.wasm

xatlas-dbg.wasm: $(SRC_FILES)
	$(WASI_SDK_PATH)/clang $(C_FLAGS) -DJS_DEBUG=1 -Og $(SRC_FILES) $(LD_FLAGS) \
	-Wl,--export=xatlasAddMeshJoin,--export=xatlasAddMeshErrorString,--export=xatlasProgressCategoryString \
	-o xatlas-dbg.wasm

xatlas.wasm: $(SRC_FILES)
	$(WASI_SDK_PATH)/clang $(C_FLAGS) -DNDEBUG -O3 -Ofast -Os $(SRC_FILES) $(LD_FLAGS) \
	-Wl,--strip-all,-O3,--lto-O3,--lto-CGO3 \
	-o xatlas-rel.wasm

xatlas-opt.wasm: xatlas.wasm
	$(BINARYEN_PATH)/wasm-opt -O3 -O4 -s --directize --vacuum --zero-filled-memory --enable-nontrapping-float-to-int --enable-bulk-memory --strip-debug --strip-producers --strip-dwarf \
	-o xatlas.wasm xatlas-rel.wasm

clean:
	rm -f xatlas-dbg.wasm xatlas.wasm xatlas-opt.wasm

.PHONY: all clean
