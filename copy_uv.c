#include "./xatlas/source/xatlas/xatlas_c.h"
#include <stdint.h>

uint32_t copy_uv(xatlasAtlas * atlas, xatlasMesh * mesh, void * output) {
    const uint32_t vertex_count = mesh->vertexCount;
    uint32_t * original_index = (uint32_t *) output;
    float * uv = (float *) (original_index + vertex_count);
    const float width = atlas->width;
    const float height = atlas->height;

    for (uint32_t i = 0; i < vertex_count; i++) {
        const xatlasVertex * vertex = &mesh->vertexArray[i];
        original_index[i] = vertex->xref;
        uv[i * 2] = vertex->uv[0] / width;
        uv[i * 2 + 1] = vertex->uv[1] / height;
    }
    return vertex_count;
}
