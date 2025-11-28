import { memo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, DoubleSide } from "three";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";

function AutBadge3D({ url }) {
  const meshRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);

  const texture = useLoader(TextureLoader, url);

  const onPointerDown = (event) => {
    setIsDragging(true);
    setAutoRotate(false);
    setDragStart({
      x: event.clientX,
      y: event.clientY
    });
  };

  const onPointerUp = () => {
    setIsDragging(false);
    setAutoRotate(true);
  };

  const onPointerMove = (event) => {
    if (isDragging) {
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      setRotation((r) => ({
        x: r.x + deltaY * 0.01,
        y: r.y + deltaX * 0.01
      }));
      setDragStart({
        x: event.clientX,
        y: event.clientY
      });
    }
  };

  useFrame(() => {
    if (meshRef.current) {
      if (autoRotate) {
        meshRef.current.rotation.y += 0.01;
      } else {
        meshRef.current.rotation.x = rotation.x;
        meshRef.current.rotation.y = rotation.y;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
    >
      <planeGeometry args={[5, 7]} />
      <meshBasicMaterial map={texture} transparent={true} side={DoubleSide} />
    </mesh>
  );
}

function AutBadge3DScene({ url, onClose }) {
  return (
    <Canvas
      onPointerMissed={onClose}
      camera={{ position: [0, 0, 10], fov: 60 }}
    >
      {/* @ts-ignore */}
      <ambientLight intensity={0.5} />
      <AutBadge3D url={url} />
    </Canvas>
  );
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "transparent",
    boxShadow: "none",
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none"
  }
}));

const AutID3DBadgeDialog = ({ open, onClose, url }) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: { backgroundColor: "transparent", boxShadow: "none" }
      }}
    >
      <AutBadge3DScene onClose={onClose} url={url} />
    </StyledDialog>
  );
};

export default memo(AutID3DBadgeDialog);
