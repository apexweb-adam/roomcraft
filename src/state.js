export const OBJECTS = ['Armchair','Desk','Plant','Floor lamp','Coffee table'];
export const initialState = () => ({version:1,layout:'Studio',atmosphere:'Daylight',finish:'Chalk',selected:'Armchair',light:true,objects:Object.fromEntries(OBJECTS.map(n=>[n,{x:0,rotation:0}]))});
export function updateScene(state,action) {
  switch(action.type) {
    case 'reset': return initialState();
    case 'layout': return ['Studio','Lounge'].includes(action.value)?{...state,layout:action.value,objects:initialState().objects}:state;
    case 'atmosphere': return ['Daylight','Golden hour','Night'].includes(action.value)?{...state,atmosphere:action.value}:state;
    case 'finish': return ['Chalk','Sage','Clay'].includes(action.value)?{...state,finish:action.value}:state;
    case 'select': return OBJECTS.includes(action.value)?{...state,selected:action.value}:state;
    case 'light': return {...state,light:!state.light};
    case 'move': {
      if(!Number.isFinite(action.value))return state;
      const obj=state.objects[state.selected];
      return {...state,objects:{...state.objects,[state.selected]:{...obj,x:Math.max(-0.7,Math.min(0.7,Math.round((obj.x+action.value)*100)/100))}}};
    }
    case 'rotate': {
      if(!Number.isFinite(action.value))return state;
      return {...state,objects:{...state.objects,[state.selected]:{...state.objects[state.selected],rotation:Math.max(-180,Math.min(180,action.value))}}};
    }
    default:return state;
  }
}
export const exportScene = state => ({format:'roomcraft-scene',version:1,createdWith:'Roomcraft by Ádám Tokár',units:'metres',room:{width:6,depth:5,height:3.2},...state});
export function restoreScene(value) {
  const clean=initialState();
  if(!value||value.version!==1)return clean;
  for(const [key,options] of Object.entries({layout:['Studio','Lounge'],atmosphere:['Daylight','Golden hour','Night'],finish:['Chalk','Sage','Clay'],selected:OBJECTS})) if(options.includes(value[key]))clean[key]=value[key];
  if(typeof value.light==='boolean')clean.light=value.light;
  for(const name of OBJECTS){const obj=value.objects?.[name];if(obj&&Number.isFinite(obj.x)&&Number.isFinite(obj.rotation))clean.objects[name]={x:Math.max(-0.7,Math.min(0.7,obj.x)),rotation:Math.max(-180,Math.min(180,obj.rotation))};}
  return clean;
}
