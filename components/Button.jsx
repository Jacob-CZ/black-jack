
export default function BoxButton(props) {

  return (
    <mesh  onClick={props.onClick} {...props}>
      <circleGeometry />
      <meshStandardMaterial  color="orange" />
    </mesh>
  );
}

// Usage