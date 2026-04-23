import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import '../../styles/components/AvatarCreator.css'

// MODELO 3D DEL AVATAR 
export const AvatarCartoon = ({ config }) => {
  const grupoRef = useRef()

  useFrame((state) => {
    if (grupoRef.current) {
      grupoRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      grupoRef.current.position.y = -0.8 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    }
  })

  return (
    <group ref={grupoRef} position={[0, -0.8, 0]}>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color={config.skinColor} />
      </mesh>

      <mesh position={[-0.18, 1.28, 0.5]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.18, 1.28, 0.5]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.18, 1.28, 0.58]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={config.eyeColor} />
      </mesh>
      <mesh position={[0.18, 1.28, 0.58]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={config.eyeColor} />
      </mesh>

      <mesh position={[0, 1.18, 0.54]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color={config.skinColor} />
      </mesh>

      {config.hairStyle === 'short' && (
        <mesh position={[0, 1.62, 0]}>
          <sphereGeometry args={[0.57, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={config.hairColor} />
        </mesh>
      )}
      {config.hairStyle === 'spiky' && (
        <>
          <mesh position={[0, 1.72, 0]}>
            <coneGeometry args={[0.15, 0.4, 8]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>
          <mesh position={[-0.25, 1.65, 0]} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[0.12, 0.35, 8]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>
          <mesh position={[0.25, 1.65, 0]} rotation={[0, 0, -0.5]}>
            <coneGeometry args={[0.12, 0.35, 8]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>
        </>
      )}
      {config.hairStyle === 'long' && (
        <>
          <mesh position={[0, 1.62, 0]}>
            <sphereGeometry args={[0.57, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>
          <mesh position={[-0.5, 0.9, 0]}>
            <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>
          <mesh position={[0.5, 0.9, 0]}>
            <capsuleGeometry args={[0.08, 0.6, 8, 16]} />
            <meshStandardMaterial color={config.hairColor} />
          </mesh>
        </>
      )}
      {config.hairStyle === 'bald' && null}

      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.2, 16]} />
        <meshStandardMaterial color={config.skinColor} />
      </mesh>

      <mesh position={[0, 0.3, 0]}>
        <capsuleGeometry args={[0.28, 0.5, 8, 16]} />
        <meshStandardMaterial color={config.clothesColor} />
      </mesh>

      <mesh position={[-0.45, 0.35, 0]} rotation={[0, 0, -0.4]}>
        <capsuleGeometry args={[0.1, 0.4, 8, 16]} />
        <meshStandardMaterial color={config.clothesColor} />
      </mesh>
      <mesh position={[0.45, 0.35, 0]} rotation={[0, 0, 0.4]}>
        <capsuleGeometry args={[0.1, 0.4, 8, 16]} />
        <meshStandardMaterial color={config.clothesColor} />
      </mesh>

      <mesh position={[-0.6, 0.1, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={config.skinColor} />
      </mesh>
      <mesh position={[0.6, 0.1, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={config.skinColor} />
      </mesh>

      <mesh position={[-0.16, -0.3, 0]}>
        <capsuleGeometry args={[0.11, 0.35, 8, 16]} />
        <meshStandardMaterial color={config.clothesColor} />
      </mesh>
      <mesh position={[0.16, -0.3, 0]}>
        <capsuleGeometry args={[0.11, 0.35, 8, 16]} />
        <meshStandardMaterial color={config.clothesColor} />
      </mesh>

      <mesh position={[-0.16, -0.58, 0.06]} rotation={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.09, 0.2, 8, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.16, -0.58, 0.06]} rotation={[0.3, 0, 0]}>
        <capsuleGeometry args={[0.09, 0.2, 8, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  )
}

// COMPONENTE PRINCIPAL
const AvatarCreator = ({ config, onChange, soloVista = false }) => {
  const opciones = {
    skinColor: [
      { label: 'Claro', value: '#FDBCB4' },
      { label: 'Medio', value: '#D4956A' },
      { label: 'Oscuro', value: '#8D5524' },
      { label: 'Fantasma', value: '#E8E8E8' },
    ],
    hairColor: [
      { label: 'Negro', value: '#1A1A1A' },
      { label: 'Castaño', value: '#6B3A2A' },
      { label: 'Rubio', value: '#F5D76E' },
      { label: 'Rojo', value: '#C0392B' },
      { label: 'Blanco', value: '#F0F0F0' },
      { label: 'Azul', value: '#3498DB' },
      { label: 'Verde', value: '#2ECC71' },
      { label: 'Rosa', value: '#FF69B4' },
    ],
    hairStyle: [
      { label: 'Corto', value: 'short' },
      { label: 'Puntiagudo', value: 'spiky' },
      { label: 'Largo', value: 'long' },
      { label: 'Calvo', value: 'bald' },
    ],
    clothesColor: [
      { label: 'Rojo', value: '#E94560' },
      { label: 'Azul', value: '#3498DB' },
      { label: 'Verde', value: '#2ECC71' },
      { label: 'Negro', value: '#2C2C2C' },
      { label: 'Morado', value: '#9B59B6' },
      { label: 'Naranja', value: '#E67E22' },
      { label: 'Blanco', value: '#ECF0F1' },
      { label: 'Rosa', value: '#FF69B4' },
    ],
    eyeColor: [
      { label: 'Marrón', value: '#6B3A2A' },
      { label: 'Azul', value: '#3498DB' },
      { label: 'Verde', value: '#2ECC71' },
      { label: 'Negro', value: '#1A1A1A' },
      { label: 'Rojo', value: '#E74C3C' },
    ],
  }

  return (
    <div className={`avatar-creator ${soloVista ? 'solo-vista' : ''}`}>

      <div className="avatar-canvas">
        <Canvas
          camera={{ position: [0, 0.5, 3], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[2, 3, 2]} intensity={1} />
          <directionalLight position={[-2, 0, -2]} intensity={0.4} />
          <AvatarCartoon config={config} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Canvas>
      </div>

      {!soloVista && (
        <div className="avatar-controls">
          <div className="avatar-control-group">
            <label>Color de piel</label>
            <div className="avatar-color-options">
              {opciones.skinColor.map((op) => (
                <button
                  key={op.value}
                  className={`color-btn ${config.skinColor === op.value ? 'active' : ''}`}
                  style={{ background: op.value }}
                  onClick={() => onChange({ ...config, skinColor: op.value })}
                  title={op.label}
                />
              ))}
            </div>
          </div>

          <div className="avatar-control-group">
            <label>Estilo de pelo</label>
            <div className="avatar-style-options">
              {opciones.hairStyle.map((op) => (
                <button
                  key={op.value}
                  className={`style-btn ${config.hairStyle === op.value ? 'active' : ''}`}
                  onClick={() => onChange({ ...config, hairStyle: op.value })}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          <div className="avatar-control-group">
            <label>Color de pelo</label>
            <div className="avatar-color-options">
              {opciones.hairColor.map((op) => (
                <button
                  key={op.value}
                  className={`color-btn ${config.hairColor === op.value ? 'active' : ''}`}
                  style={{ background: op.value }}
                  onClick={() => onChange({ ...config, hairColor: op.value })}
                  title={op.label}
                />
              ))}
            </div>
          </div>

          <div className="avatar-control-group">
            <label>Color de ropa</label>
            <div className="avatar-color-options">
              {opciones.clothesColor.map((op) => (
                <button
                  key={op.value}
                  className={`color-btn ${config.clothesColor === op.value ? 'active' : ''}`}
                  style={{ background: op.value }}
                  onClick={() => onChange({ ...config, clothesColor: op.value })}
                  title={op.label}
                />
              ))}
            </div>
          </div>

          <div className="avatar-control-group">
            <label>Color de ojos</label>
            <div className="avatar-color-options">
              {opciones.eyeColor.map((op) => (
                <button
                  key={op.value}
                  className={`color-btn ${config.eyeColor === op.value ? 'active' : ''}`}
                  style={{ background: op.value }}
                  onClick={() => onChange({ ...config, eyeColor: op.value })}
                  title={op.label}
                />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AvatarCreator