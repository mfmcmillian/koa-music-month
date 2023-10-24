import {engine, Material, MaterialTransparencyMode, MeshRenderer, Transform, VideoPlayer} from "@dcl/sdk/ecs";
import {Color3, Quaternion, Vector3} from "@dcl/sdk/math";

export function createVideoScreens(){
    const videoEntity = engine.addEntity()
    const videoTexture = Material.Texture.Video({videoPlayerEntity: videoEntity})
    VideoPlayer.create(videoEntity, {
        src: 'https://live.seed.events:8443/live/koa/index.m3u8',
        playing: true,
        loop: true,
    })

    const videoMat = {
        texture: videoTexture,
        roughness: 1.0,
        specularIntensity: 0,
        metallic: 0,
        emissiveTexture: videoTexture,
        emissiveIntensity: 1,
        emissiveColor: Color3.White(),
    }

    // #1
    const screen = engine.addEntity()
    MeshRenderer.setPlane(screen)
    Transform.create(screen, {
        position: {x: 1.5, y: 2.25, z: 14.5},
        rotation: Quaternion.fromEulerDegrees(0, -90, 0),
        scale: Vector3.create(5, 3, 3)
    })
    Material.setPbrMaterial(screen, videoMat)


    const screen2 = engine.addEntity()
    MeshRenderer.setPlane(screen2)
    Transform.create(screen2, {
        position: {x: 1.5, y: 12.25, z: 14.5},
        rotation: Quaternion.fromEulerDegrees(0, -90, 0),
        scale: Vector3.create(16, 9, 1)
    })
    Material.setPbrMaterial(screen2,
        {
            ...videoMat,
            alphaTexture: Material.Texture.Common({src: "images/black-alpha.png"}),
            transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST_AND_ALPHA_BLEND
        })

}