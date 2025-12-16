import { useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from 'three';

function useFixedScreenSizePlane(meshRef: React.RefObject<THREE.Mesh>, pixelWidth: number, pixelHeight: number) {
  const { camera, size } = useThree();

  useFrame(() => {
    if (!meshRef.current) return;
    if (!(camera instanceof OrthographicCamera)) return;

    const worldPerPixel = (camera.top - camera.bottom) / camera.zoom / size.height;

    meshRef.current.scale.set(pixelWidth * worldPerPixel, pixelHeight * worldPerPixel, 1);
  });
}

export default useFixedScreenSizePlane;
