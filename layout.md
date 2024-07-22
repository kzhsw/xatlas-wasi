# Struct Layout

#### xatlasChart

| Member       | Offset |
|--------------|--------|
| faceArray    | 0      |
| atlasIndex   | 4      |
| faceCount    | 8      |
| type         | 12     |
| material     | 16     |
| **Size**     | **20** |

#### xatlasVertex

| Member       | Offset |
|--------------|--------|
| atlasIndex   | 0      |
| chartIndex   | 4      |
| uv           | 8      |
| xref         | 16     |
| **Size**     | **20** |

#### xatlasMesh

| Member       | Offset |
|--------------|--------|
| chartArray   | 0      |
| indexArray   | 4      |
| vertexArray  | 8      |
| chartCount   | 12     |
| indexCount   | 16     |
| vertexCount  | 20     |
| **Size**     | **24** |

#### xatlasAtlas

| Member            | Offset |
|-------------------|--------|
| image             | 0      |
| meshes            | 4      |
| utilization       | 8      |
| width             | 12     |
| height            | 16     |
| atlasCount        | 20     |
| chartCount        | 24     |
| meshCount         | 28     |
| texelsPerUnit     | 32     |
| **Size**          | **36** |

#### xatlasMeshDecl

| Member                | Offset |
|-----------------------|--------|
| vertexPositionData    | 0      |
| vertexNormalData      | 4      |
| vertexUvData          | 8      |
| indexData             | 12     |
| faceIgnoreData        | 16     |
| faceMaterialData      | 20     |
| faceVertexCount       | 24     |
| vertexCount           | 28     |
| vertexPositionStride  | 32     |
| vertexNormalStride    | 36     |
| vertexUvStride        | 40     |
| indexCount            | 44     |
| indexOffset           | 48     |
| faceCount             | 52     |
| indexFormat           | 56     |
| epsilon               | 60     |
| **Size**              | **64** |

#### xatlasUvMeshDecl

| Member             | Offset |
|--------------------|--------|
| vertexUvData       | 0      |
| indexData          | 4      |
| faceMaterialData   | 8      |
| vertexCount        | 12     |
| vertexStride       | 16     |
| indexCount         | 20     |
| indexOffset        | 24     |
| indexFormat        | 28     |
| **Size**           | **32** |

#### xatlasChartOptions

| Member                 | Offset |
|------------------------|--------|
| paramFunc              | 0      |
| maxChartArea           | 4      |
| maxBoundaryLength      | 8      |
| normalDeviationWeight  | 12     |
| roundnessWeight        | 16     |
| straightnessWeight     | 20     |
| normalSeamWeight       | 24     |
| textureSeamWeight      | 28     |
| maxCost                | 32     |
| maxIterations          | 36     |
| useInputMeshUvs        | 40     |
| fixWinding             | 41     |
| **Size**               | **44** |

#### xatlasPackOptions

| Member                | Offset |
|-----------------------|--------|
| maxChartSize          | 0      |
| padding               | 4      |
| texelsPerUnit         | 8      |
| resolution            | 12     |
| bilinear              | 16     |
| blockAlign            | 17     |
| bruteForce            | 18     |
| createImage           | 19     |
| rotateChartsToAxis    | 20     |
| rotateCharts          | 21     |
| **Size**              | **24** |
