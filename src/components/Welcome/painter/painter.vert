#version 300 es
precision mediump float;
const vec2 positions[4] = vec2[4](
    vec2(-1.0, -1.0), 
    vec2(1.0, -1.0), 
    vec2(-1.0, 1.0), 
    vec2(1.0, 1.0)
);
out vec2 uv;

void main() {
    uv = positions[gl_VertexID];
    gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
}