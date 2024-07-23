# Struct Layout

#### xatlasChart

| Member       | Offset | Type               | Size |
|--------------|--------|--------------------|------|
| faceArray    | 0      | `const uint32_t*`  | 4    |
| atlasIndex   | 4      | `uint32_t`         | 4    |
| faceCount    | 8      | `uint32_t`         | 4    |
| type         | 12     | `uint32_t`         | 4    |
| material     | 16     | `uint32_t`         | 4    |
| **Size**     | **20** |                    |      |

#### xatlasVertex

| Member       | Offset | Type               | Size |
|--------------|--------|--------------------|------|
| atlasIndex   | 0      | `uint32_t`         | 4    |
| chartIndex   | 4      | `uint32_t`         | 4    |
| uv           | 8      | `float[2]`         | 8    |
| xref         | 16     | `uint32_t`         | 4    |
| **Size**     | **20** |                    |      |

#### xatlasMesh

| Member       | Offset | Type                | Size |
|--------------|--------|---------------------|------|
| chartArray   | 0      | `const xatlasChart*`| 4    |
| indexArray   | 4      | `const uint32_t*`   | 4    |
| vertexArray  | 8      | `const xatlasVertex*`| 4   |
| chartCount   | 12     | `uint32_t`          | 4    |
| indexCount   | 16     | `uint32_t`          | 4    |
| vertexCount  | 20     | `uint32_t`          | 4    |
| **Size**     | **24** |                     |      |

#### xatlasAtlas

| Member            | Offset | Type                | Size |
|-------------------|--------|---------------------|------|
| image             | 0      | `uint8_t*`          | 4    |
| meshes            | 4      | `xatlasMesh*`       | 4    |
| utilization       | 8      | `float`             | 4    |
| width             | 12     | `uint32_t`          | 4    |
| height            | 16     | `uint32_t`          | 4    |
| atlasCount        | 20     | `uint32_t`          | 4    |
| chartCount        | 24     | `uint32_t`          | 4    |
| meshCount         | 28     | `uint32_t`          | 4    |
| texelsPerUnit     | 32     | `float`             | 4    |
| **Size**          | **36** |                     |      |

#### xatlasMeshDecl

| Member                | Offset | Type                | Size |
|-----------------------|--------|---------------------|------|
| vertexPositionData    | 0      | `const void*`       | 4    |
| vertexNormalData      | 4      | `const void*`       | 4    |
| vertexUvData          | 8      | `const void*`       | 4    |
| indexData             | 12     | `const void*`       | 4    |
| faceIgnoreData        | 16     | `const uint8_t*`    | 4    |
| faceMaterialData      | 20     | `const uint32_t*`   | 4    |
| faceVertexCount       | 24     | `const uint8_t*`    | 4    |
| vertexCount           | 28     | `uint32_t`          | 4    |
| vertexPositionStride  | 32     | `uint32_t`          | 4    |
| vertexNormalStride    | 36     | `uint32_t`          | 4    |
| vertexUvStride        | 40     | `uint32_t`          | 4    |
| indexCount            | 44     | `uint32_t`          | 4    |
| indexOffset           | 48     | `uint32_t`          | 4    |
| faceCount             | 52     | `uint32_t`          | 4    |
| indexFormat           | 56     | `uint32_t`          | 4    |
| epsilon               | 60     | `float`             | 4    |
| **Size**              | **64** |                     |      |

#### xatlasUvMeshDecl

| Member             | Offset | Type                | Size |
|--------------------|--------|---------------------|------|
| vertexUvData       | 0      | `const void*`       | 4    |
| indexData          | 4      | `const void*`       | 4    |
| faceMaterialData   | 8      | `const uint32_t*`   | 4    |
| vertexCount        | 12     | `uint32_t`          | 4    |
| vertexStride       | 16     | `uint32_t`          | 4    |
| indexCount         | 20     | `uint32_t`          | 4    |
| indexOffset        | 24     | `uint32_t`          | 4    |
| indexFormat        | 28     | `uint32_t`          | 4    |
| **Size**           | **32** |                     |      |

#### xatlasChartOptions

| Member                 | Offset | Type                | Size |
|------------------------|--------|---------------------|------|
| paramFunc              | 0      | `ParamFunc`         | 4    |
| maxChartArea           | 4      | `float`             | 4    |
| maxBoundaryLength      | 8      | `float`             | 4    |
| normalDeviationWeight  | 12     | `float`             | 4    |
| roundnessWeight        | 16     | `float`             | 4    |
| straightnessWeight     | 20     | `float`             | 4    |
| normalSeamWeight       | 24     | `float`             | 4    |
| textureSeamWeight      | 28     | `float`             | 4    |
| maxCost                | 32     | `float`             | 4    |
| maxIterations          | 36     | `uint32_t`          | 4    |
| useInputMeshUvs        | 40     | `bool`              | 1    |
| fixWinding             | 41     | `bool`              | 1    |
| **Size**               | **44** |                     |      |

#### xatlasPackOptions

| Member                | Offset | Type                | Size |
|-----------------------|--------|---------------------|------|
| maxChartSize          | 0      | `uint32_t`          | 4    |
| padding               | 4      | `uint32_t`          | 4    |
| texelsPerUnit         | 8      | `float`             | 4    |
| resolution            | 12     | `uint32_t`          | 4    |
| bilinear              | 16     | `bool`              | 1    |
| blockAlign            | 17     | `bool`              | 1    |
| bruteForce            | 18     | `bool`              | 1    |
| createImage           | 19     | `bool`              | 1    |
| rotateChartsToAxis    | 20     | `bool`              | 1    |
| rotateCharts          | 21     | `bool`              | 1    |
| **Size**              | **24** |                     |      |

