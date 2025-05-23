#version 300 es
precision highp float;

uniform float uniTime;
uniform vec2 uniScreenSize;

in vec2 uv;
out vec4 fragColor;

float rand(vec2 p) {
    return fract(sin(dot(p.xy, vec2(1., 300.))) * 43758.5453123);
}

// Based on Morgan McGuire
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Four corners in 2D of a tile
    float a = rand(i);
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 5
float fbm(vec2 p) {
    // Initial values
    float value = 0.;
    float amplitude = .4;
    float frequency = 0.;

    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(p);
        p *= 2.;
        amplitude *= .4;
    }
    return value;
}

float alpha(float speed) {
    return 0.5 * (1.0 + sin(uniTime * speed));
}

const float PIXEL = 16.0;

void main() {
    vec2 p = uv.xy;
    ivec2 f = ivec2(gl_FragCoord.xy) % ivec2(PIXEL);
    if (f.x == 0 || f.y == 0) {
        fragColor = vec4(0, 0, 0, 1);
        return;
    };

    p = PIXEL * floor(gl_FragCoord.xy / PIXEL);
    p /= uniScreenSize;
    p *= 2.0;
    p -= vec2(1);

    float gradient = mix(p.y*.6 + .1, p.y*1.2 + .9, fbm(p));
    float speed = 0.5;
    float details = 7.;
    float force = 10.0; //.9;
    float shift = 0.0;
   
    vec2 fast = vec2(p.x, p.y - uniTime*speed) * details;
    float ns_a = fbm(fast);
    float ns_b = force * fbm(fast + ns_a + uniTime) - shift;    
    float nns = force * fbm(vec2(ns_a, ns_b));
    float ins = fbm(vec2(ns_b, ns_a));

    vec3 c1 = mix(vec3(.9, .5, .3), vec3(.5, .0, .0), ins + shift);
    vec3 c2 = vec3(ins - gradient);
    vec3 c = c1 + c2;
    float light = c.r;
    light = pow(light, mix(2.0, 2.1, alpha(1.412)));
    vec3 color = mix(vec3(1.0, .6667, 0.0), vec3(.8, .333, 0.0), alpha(0.71)) * light;

    fragColor = vec4(color, 1.0);
}