import {
  AmbientLight,
  Box3,
  BoxGeometry,
  BufferGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineLoop,
  LineSegments,
  type Material,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import type { PersonalProject } from "../data/personal-work";

export type SceneColors = {
  background: string;
  surface: string;
  accent: string;
  evidence: string;
};

export type Observatory = {
  start(): void;
  stop(): void;
  resize(width: number, height: number, dpr: number): void;
  highlight(id: string | null): void;
  setPointer(x: number, y: number): void;
  setScroll(progress: number): void;
  setTheme(colors: SceneColors): void;
  dispose(): void;
};

export async function createObservatory(
  canvas: HTMLCanvasElement,
  projects: readonly { id: string; kind: PersonalProject["kind"] }[],
  colors: SceneColors,
): Promise<Observatory> {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  let renderer: WebGLRenderer | undefined;
  let disposed = false;
  let running = false;
  let lastTime: number | null = null;
  let elapsed = 0;
  let shaderError: Error | null = null;

  function ownGeometry<T extends BufferGeometry>(geometry: T): T {
    geometries.add(geometry);
    return geometry;
  }

  function ownMaterial<T extends Material>(material: T): T {
    materials.add(material);
    return material;
  }

  function dispose(): void {
    if (disposed) return;
    disposed = true;
    running = false;
    lastTime = null;
    renderer?.setAnimationLoop(null);
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    geometries.clear();
    materials.clear();
    renderer?.dispose();
  }

  try {
    // Supplying the context makes unsupported WebGL fail before renderer-owned listeners exist.
    const context = canvas.getContext("webgl2", {
      alpha: false,
      antialias: true,
      depth: true,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    if (!context || context.isContextLost()) {
      throw new Error("The observatory requires an available WebGL 2 context.");
    }

    const webgl = new WebGLRenderer({ canvas, context, antialias: true, alpha: false });
    renderer = webgl;
    webgl.debug.checkShaderErrors = true;
    webgl.debug.onShaderError = (gl, program, vertexShader, fragmentShader) => {
      shaderError = new Error(
        [
          "Observatory shader compilation failed.",
          gl.getProgramInfoLog(program),
          gl.getShaderInfoLog(vertexShader),
          gl.getShaderInfoLog(fragmentShader),
        ]
          .filter(Boolean)
          .join("\n"),
      );
    };

    const scene = new Scene();
    const background = new Color(colors.background);
    const surface = new Color(colors.surface);
    const accent = new Color(colors.accent);
    const evidence = new Color(colors.evidence);
    scene.background = background;

    const camera = new OrthographicCamera(-6, 6, 5, -5, 0.1, 50);
    camera.position.set(7, 5, 8);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();

    const composition = new Group();
    const core = new Group();
    scene.add(composition);
    composition.add(core);

    const ambient = new AmbientLight(surface, 2.1);
    const keyLight = new DirectionalLight(accent, 3.2);
    keyLight.position.set(3, 7, 5);
    const rimLight = new DirectionalLight(evidence, 1.4);
    rimLight.position.set(-5, 3, -3);
    scene.add(ambient, keyLight, rimLight);

    const slabGeometry = ownGeometry(new BoxGeometry(1.2, 0.18, 1.2));
    const slabEdges = ownGeometry(new EdgesGeometry(slabGeometry));
    const slabMaterial = ownMaterial(
      new MeshStandardMaterial({ color: surface, metalness: 0.32, roughness: 0.38 }),
    );
    const coreEdgesMaterial = ownMaterial(new LineBasicMaterial({ color: accent }));
    for (let index = 0; index < 3; index++) {
      const slab = new Mesh(slabGeometry, slabMaterial);
      const edges = new LineSegments(slabEdges, coreEdgesMaterial);
      slab.position.y = index * 0.28;
      slab.add(edges);
      core.add(slab);
    }

    const crystalGeometry = ownGeometry(new IcosahedronGeometry(0.55, 0));
    const crystalEdges = ownGeometry(new EdgesGeometry(crystalGeometry));
    const crystalMaterial = ownMaterial(
      new MeshStandardMaterial({
        color: surface,
        emissive: accent,
        emissiveIntensity: 0.13,
        metalness: 0.48,
        roughness: 0.28,
        flatShading: true,
      }),
    );
    const crystal = new Mesh(crystalGeometry, crystalMaterial);
    crystal.position.y = 1.3;
    crystal.add(new LineSegments(crystalEdges, coreEdgesMaterial));
    core.add(crystal);

    const ringPositions = new Float32Array(128 * 3);
    for (let index = 0; index < 128; index++) {
      const angle = (2 * Math.PI * index) / 128;
      ringPositions[index * 3] = Math.cos(angle);
      ringPositions[index * 3 + 2] = Math.sin(angle);
    }
    const ringGeometry = ownGeometry(new BufferGeometry());
    ringGeometry.setAttribute("position", new Float32BufferAttribute(ringPositions, 3));
    const orbitAccentMaterial = ownMaterial(new LineBasicMaterial());
    const orbitEvidenceMaterial = ownMaterial(new LineBasicMaterial());
    const radii = [1.4, 2.2, 3.3];
    for (let index = 0; index < radii.length; index++) {
      const ring = new LineLoop(
        ringGeometry,
        index === 1 ? orbitEvidenceMaterial : orbitAccentMaterial,
      );
      ring.scale.setScalar(radii[index]!);
      ring.position.y = 0.15;
      ring.rotation.set(0.035 * (index + 1), 0, 0.045 * (index - 1));
      composition.add(ring);
    }

    const unitBox = ownGeometry(new BoxGeometry(1, 1, 1));
    const unitEdges = ownGeometry(new EdgesGeometry(unitBox));
    const nodes = projects.map((project, index) => {
      const angle = (2 * Math.PI * index) / projects.length;
      const x = 3.8 * Math.cos(angle);
      const y = 0.3 + 0.25 * (index % 2);
      const z = 2.5 * Math.sin(angle);
      const material = ownMaterial(
        new MeshStandardMaterial({ metalness: 0.25, roughness: 0.42, emissiveIntensity: 0.13 }),
      );
      const edgeMaterial = ownMaterial(new LineBasicMaterial());
      const connectionMaterial = ownMaterial(new LineBasicMaterial());
      const module = new Mesh(unitBox, material);
      module.position.set(x, y, z);
      module.scale.setScalar(0.45);
      module.add(new LineSegments(unitEdges, edgeMaterial));
      composition.add(module);

      const connectionGeometry = ownGeometry(new BufferGeometry());
      connectionGeometry.setAttribute(
        "position",
        new Float32BufferAttribute([0, 0.3, 0, x, y, z], 3),
      );
      composition.add(new LineSegments(connectionGeometry, connectionMaterial));
      return {
        id: project.id,
        copper: project.kind === "fork" || project.kind === "derived",
        material,
        edgeMaterial,
        connectionMaterial,
      };
    });

    const gridPositions = new Float32Array(11 * 4 * 3);
    for (let index = 0; index < 11; index++) {
      const coordinate = index - 5;
      gridPositions.set(
        [coordinate, -0.24, -5, coordinate, -0.24, 5, -5, -0.24, coordinate, 5, -0.24, coordinate],
        index * 12,
      );
    }
    const gridGeometry = ownGeometry(new BufferGeometry());
    gridGeometry.setAttribute("position", new Float32BufferAttribute(gridPositions, 3));
    const gridMaterial = ownMaterial(new LineBasicMaterial());
    composition.add(new LineSegments(gridGeometry, gridMaterial));

    // Fixed integer arithmetic gives every visit the same 96 sparse points, without random state.
    const particlePositions = new Float32Array(96 * 3);
    for (let index = 0; index < 96; index++) {
      particlePositions[index * 3] = (((index * 137 + 43) % 997) / 997 - 0.5) * 9.6;
      particlePositions[index * 3 + 1] = (((index * 89 + 67) % 991) / 991) * 3.8 - 0.4;
      particlePositions[index * 3 + 2] = (((index * 211 + 29) % 983) / 983 - 0.5) * 7.6;
    }
    const particleGeometry = ownGeometry(new BufferGeometry());
    particleGeometry.setAttribute("position", new Float32BufferAttribute(particlePositions, 3));
    const particleMaterial = ownMaterial(new PointsMaterial({ size: 1.7, sizeAttenuation: false }));
    composition.add(new Points(particleGeometry, particleMaterial));

    let highlighted: string | null = null;
    function applyColors(): void {
      ambient.color.copy(surface);
      keyLight.color.copy(accent);
      rimLight.color.copy(evidence);
      slabMaterial.color.copy(surface);
      coreEdgesMaterial.color.copy(accent);
      crystalMaterial.color.copy(surface);
      crystalMaterial.emissive.copy(accent);
      orbitAccentMaterial.color.copy(background).lerp(accent, 0.4);
      orbitEvidenceMaterial.color.copy(background).lerp(evidence, 0.42);
      gridMaterial.color.copy(background).lerp(accent, 0.12);
      particleMaterial.color.copy(background).lerp(accent, 0.42);
      for (const node of nodes) {
        const color = node.copper ? evidence : accent;
        const selected = highlighted === node.id;
        const dimmed = highlighted !== null && !selected;
        node.material.color.copy(surface).lerp(color, selected ? 0.7 : dimmed ? 0.08 : 0.25);
        node.material.emissive.copy(color);
        node.material.emissiveIntensity = selected ? 0.45 : dimmed ? 0.02 : 0.13;
        node.edgeMaterial.color.copy(background).lerp(color, dimmed ? 0.22 : 1);
        node.connectionMaterial.color
          .copy(background)
          .lerp(color, selected ? 0.85 : dimmed ? 0.1 : 0.38);
      }
    }
    applyColors();

    // Fit projected bounds, allowing room for parallax and the composition's small float.
    const bounds = new Box3().setFromObject(composition).expandByScalar(0.65);
    const corner = new Vector3();
    let horizontalExtent = 0;
    let verticalExtent = 0;
    for (let index = 0; index < 8; index++) {
      corner
        .set(
          index & 1 ? bounds.max.x : bounds.min.x,
          index & 2 ? bounds.max.y : bounds.min.y,
          index & 4 ? bounds.max.z : bounds.min.z,
        )
        .applyMatrix4(camera.matrixWorldInverse);
      horizontalExtent = Math.max(horizontalExtent, Math.abs(corner.x));
      verticalExtent = Math.max(verticalExtent, Math.abs(corner.y));
    }

    function renderFrame(): void {
      if (disposed) return;
      if (context!.isContextLost()) {
        throw new Error("The observatory WebGL context was lost.");
      }
      webgl.render(scene, camera);
      if (shaderError) throw shaderError;
    }

    function resize(width: number, height: number, dpr: number): void {
      if (disposed) return;
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      const aspect = safeWidth / safeHeight;
      const halfHeight = Math.max(verticalExtent, horizontalExtent / aspect);
      camera.left = -halfHeight * aspect;
      camera.right = halfHeight * aspect;
      camera.top = halfHeight;
      camera.bottom = -halfHeight;
      camera.updateProjectionMatrix();
      webgl.setPixelRatio(Math.max(0.1, Math.min(dpr, 1.5)));
      webgl.setSize(safeWidth, safeHeight, false);
      renderFrame();
    }

    function stop(): void {
      if (disposed || !running) return;
      running = false;
      lastTime = null;
      webgl.setAnimationLoop(null);
    }

    function animate(time: number): void {
      if (disposed || !running) return;
      if (context!.isContextLost()) {
        stop();
        return;
      }
      // Resetting only the clock on resume preserves angles and excludes paused time.
      if (lastTime !== null) elapsed += Math.max((time - lastTime) / 1000, 0);
      lastTime = time;
      core.rotation.y = elapsed * 0.06;
      composition.position.y = Math.sin(elapsed * 0.65) * 0.05;
      renderFrame();
    }

    // Compile once, then require an actual successful draw before exposing the scene.
    webgl.compile(scene, camera);
    if (shaderError) throw shaderError;
    const width = canvas.clientWidth || canvas.width || 1;
    const height = canvas.clientHeight || canvas.height || 1;
    resize(width, height, canvas.width / width);
    if (webgl.info.render.calls === 0) {
      throw new Error("The observatory did not render its first frame.");
    }

    let pointerX = 0;
    let pointerY = 0;
    let scrollProgress = 0;

    return {
      start(): void {
        if (disposed || running) return;
        running = true;
        lastTime = null;
        webgl.setAnimationLoop(animate);
      },
      stop,
      resize,
      highlight(id): void {
        if (disposed || highlighted === id) return;
        highlighted = id !== null && nodes.some((node) => node.id === id) ? id : null;
        applyColors();
        if (!running) renderFrame();
      },
      setPointer(x, y): void {
        if (disposed) return;
        const nextX = Math.max(-1, Math.min(x, 1));
        const nextY = Math.max(-1, Math.min(y, 1));
        if (nextX === pointerX && nextY === pointerY) return;
        pointerX = nextX;
        pointerY = nextY;
        // Both axes at their extremes still stay below a combined 0.18-radian tilt.
        composition.rotation.set(pointerY * 0.12, pointerX * 0.12, 0);
        if (!running) renderFrame();
      },
      setScroll(progress): void {
        if (disposed) return;
        const nextProgress = Math.max(0, Math.min(progress, 1));
        if (nextProgress === scrollProgress) return;
        scrollProgress = nextProgress;
        const translation = scrollProgress * 0.6;
        camera.position.set(7, 5 + translation, 8);
        camera.lookAt(0, translation, 0);
        if (!running) renderFrame();
      },
      setTheme(nextColors): void {
        if (disposed) return;
        background.set(nextColors.background);
        surface.set(nextColors.surface);
        accent.set(nextColors.accent);
        evidence.set(nextColors.evidence);
        applyColors();
        if (!running) renderFrame();
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
