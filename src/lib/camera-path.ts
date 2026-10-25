import { CatmullRomCurve3, Vector3 } from 'three';
export const cameraPositions: [number,number,number][] = [[4.7,3.25,13.4],[2.5,2.65,6],[.7,2.45,-1.2],[1.4,2.1,-4.5],[.3,2.8,-2.2]];
export const cameraTargets: [number,number,number][] = [[-1.2,2,-2],[-2.5,1.9,-3.5],[-5,2.2,-5],[3.3,2,-6.3],[.5,2.5,-10.5]];
export function createCameraPaths(){
 return {path:new CatmullRomCurve3(cameraPositions.map(p=>new Vector3(...p)),false,'catmullrom',.18),look:new CatmullRomCurve3(cameraTargets.map(p=>new Vector3(...p)),false,'catmullrom',.12)};
}
