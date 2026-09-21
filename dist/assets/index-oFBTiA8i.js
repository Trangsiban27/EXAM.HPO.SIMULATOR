(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();const ko="180",hd=0,gl=1,dd=2,sh=1,ud=2,Pn=3,Fn=0,Gt=1,Et=2,Zn=0,ki=1,_l=2,vl=3,xl=4,fd=5,hi=100,pd=101,md=102,gd=103,_d=104,vd=200,xd=201,Sd=202,yd=203,Ha=204,za=205,Md=206,Ed=207,Td=208,wd=209,bd=210,Ad=211,Rd=212,Cd=213,Pd=214,Va=0,Ga=1,Wa=2,Vi=3,Xa=4,qa=5,Ya=6,Ka=7,rh=0,Ld=1,Id=2,$n=0,Dd=1,Nd=2,Od=3,Ud=4,Fd=5,Bd=6,kd=7,Sl="attached",Hd="detached",ah=300,Gi=301,Wi=302,Za=303,$a=304,zr=306,Xi=1e3,Kn=1001,Nr=1002,Bt=1003,oh=1004,vs=1005,Zt=1006,Ar=1007,In=1008,vn=1009,lh=1010,ch=1011,bs=1012,Ho=1013,ui=1014,cn=1015,ks=1016,zo=1017,Vo=1018,As=1020,hh=35902,dh=35899,uh=1021,fh=1022,nn=1023,Rs=1026,Cs=1027,Go=1028,Wo=1029,ph=1030,Xo=1031,qo=1033,Rr=33776,Cr=33777,Pr=33778,Lr=33779,Ja=35840,ja=35841,Qa=35842,eo=35843,to=36196,no=37492,io=37496,so=37808,ro=37809,ao=37810,oo=37811,lo=37812,co=37813,ho=37814,uo=37815,fo=37816,po=37817,mo=37818,go=37819,_o=37820,vo=37821,xo=36492,So=36494,yo=36495,Mo=36283,Eo=36284,To=36285,wo=36286,Ps=2300,Ls=2301,Kr=2302,yl=2400,Ml=2401,El=2402,zd=2500,Vd=0,mh=1,bo=2,Gd=3200,Wd=3201,gh=0,Xd=1,Yn="",lt="srgb",Ht="srgb-linear",Or="linear",ht="srgb",gi=7680,Tl=519,qd=512,Yd=513,Kd=514,_h=515,Zd=516,$d=517,Jd=518,jd=519,Ao=35044,wl="300 es",gn=2e3,Ur=2001;class ji{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const s=i.indexOf(t);s!==-1&&i.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,e);e.target=null}}}const It=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let bl=1234567;const ys=Math.PI/180,qi=180/Math.PI;function sn(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(It[r&255]+It[r>>8&255]+It[r>>16&255]+It[r>>24&255]+"-"+It[e&255]+It[e>>8&255]+"-"+It[e>>16&15|64]+It[e>>24&255]+"-"+It[t&63|128]+It[t>>8&255]+"-"+It[t>>16&255]+It[t>>24&255]+It[n&255]+It[n>>8&255]+It[n>>16&255]+It[n>>24&255]).toLowerCase()}function Ye(r,e,t){return Math.max(e,Math.min(t,r))}function Yo(r,e){return(r%e+e)%e}function Qd(r,e,t,n,i){return n+(r-e)*(i-n)/(t-e)}function eu(r,e,t){return r!==e?(t-r)/(e-r):0}function Ms(r,e,t){return(1-t)*r+t*e}function tu(r,e,t,n){return Ms(r,e,1-Math.exp(-t*n))}function nu(r,e=1){return e-Math.abs(Yo(r,e*2)-e)}function iu(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function su(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function ru(r,e){return r+Math.floor(Math.random()*(e-r+1))}function au(r,e){return r+Math.random()*(e-r)}function ou(r){return r*(.5-Math.random())}function lu(r){r!==void 0&&(bl=r);let e=bl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function cu(r){return r*ys}function hu(r){return r*qi}function du(r){return(r&r-1)===0&&r!==0}function uu(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function fu(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function pu(r,e,t,n,i){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+n)/2),h=a((e+n)/2),d=s((e-n)/2),f=a((e-n)/2),u=s((n-e)/2),g=a((n-e)/2);switch(i){case"XYX":r.set(o*h,l*d,l*f,o*c);break;case"YZY":r.set(l*f,o*h,l*d,o*c);break;case"ZXZ":r.set(l*d,l*f,o*h,o*c);break;case"XZX":r.set(o*h,l*g,l*u,o*c);break;case"YXY":r.set(l*u,o*h,l*g,o*c);break;case"ZYZ":r.set(l*g,l*u,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function ln(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function at(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const Dn={DEG2RAD:ys,RAD2DEG:qi,generateUUID:sn,clamp:Ye,euclideanModulo:Yo,mapLinear:Qd,inverseLerp:eu,lerp:Ms,damp:tu,pingpong:nu,smoothstep:iu,smootherstep:su,randInt:ru,randFloat:au,randFloatSpread:ou,seededRandom:lu,degToRad:cu,radToDeg:hu,isPowerOfTwo:du,ceilPowerOfTwo:uu,floorPowerOfTwo:fu,setQuaternionFromProperEuler:pu,normalize:at,denormalize:ln};class le{constructor(e=0,t=0){le.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ye(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*i+e.x,this.y=s*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Bn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3];const f=s[a+0],u=s[a+1],g=s[a+2],_=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t+0]=f,e[t+1]=u,e[t+2]=g,e[t+3]=_;return}if(d!==_||l!==f||c!==u||h!==g){let p=1-o;const m=l*f+c*u+h*g+d*_,w=m>=0?1:-1,S=1-m*m;if(S>Number.EPSILON){const A=Math.sqrt(S),R=Math.atan2(A,m*w);p=Math.sin(p*R)/A,o=Math.sin(o*R)/A}const v=o*w;if(l=l*p+f*v,c=c*p+u*v,h=h*p+g*v,d=d*p+_*v,p===1-o){const A=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=A,c*=A,h*=A,d*=A}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,i,s,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=s[a],f=s[a+1],u=s[a+2],g=s[a+3];return e[t]=o*g+h*d+l*u-c*f,e[t+1]=l*g+h*f+c*d-o*u,e[t+2]=c*g+h*u+o*f-l*d,e[t+3]=h*g-o*d-l*f-c*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),d=o(s/2),f=l(n/2),u=l(i/2),g=l(s/2);switch(a){case"XYZ":this._x=f*h*d+c*u*g,this._y=c*u*d-f*h*g,this._z=c*h*g+f*u*d,this._w=c*h*d-f*u*g;break;case"YXZ":this._x=f*h*d+c*u*g,this._y=c*u*d-f*h*g,this._z=c*h*g-f*u*d,this._w=c*h*d+f*u*g;break;case"ZXY":this._x=f*h*d-c*u*g,this._y=c*u*d+f*h*g,this._z=c*h*g+f*u*d,this._w=c*h*d-f*u*g;break;case"ZYX":this._x=f*h*d-c*u*g,this._y=c*u*d+f*h*g,this._z=c*h*g-f*u*d,this._w=c*h*d+f*u*g;break;case"YZX":this._x=f*h*d+c*u*g,this._y=c*u*d+f*h*g,this._z=c*h*g-f*u*d,this._w=c*h*d-f*u*g;break;case"XZY":this._x=f*h*d-c*u*g,this._y=c*u*d-f*h*g,this._z=c*h*g+f*u*d,this._w=c*h*d+f*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],f=n+o+d;if(f>0){const u=.5/Math.sqrt(f+1);this._w=.25/u,this._x=(h-l)*u,this._y=(s-c)*u,this._z=(a-i)*u}else if(n>o&&n>d){const u=2*Math.sqrt(1+n-o-d);this._w=(h-l)/u,this._x=.25*u,this._y=(i+a)/u,this._z=(s+c)/u}else if(o>d){const u=2*Math.sqrt(1+o-n-d);this._w=(s-c)/u,this._x=(i+a)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+d-n-o);this._w=(a-i)/u,this._x=(s+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ye(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-s*l,this._y=i*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,s=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const u=1-t;return this._w=u*a+t*this._w,this._x=u*n+t*this._x,this._y=u*i+t*this._y,this._z=u*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=a*d+this._w*f,this._x=n*d+this._x*f,this._y=i*d+this._y*f,this._z=s*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class E{constructor(e=0,t=0,n=0){E.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Al.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Al.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-s*i),d=2*(s*n-a*t);return this.x=t+l*c+a*d-o*h,this.y=n+l*h+o*c-s*d,this.z=i+l*d+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Zr.copy(this).projectOnVector(e),this.sub(Zr)}reflect(e){return this.sub(Zr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ye(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Zr=new E,Al=new Bn;class Xe{constructor(e,t,n,i,s,a,o,l,c){Xe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c)}set(e,t,n,i,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],f=n[2],u=n[5],g=n[8],_=i[0],p=i[3],m=i[6],w=i[1],S=i[4],v=i[7],A=i[2],R=i[5],P=i[8];return s[0]=a*_+o*w+l*A,s[3]=a*p+o*S+l*R,s[6]=a*m+o*v+l*P,s[1]=c*_+h*w+d*A,s[4]=c*p+h*S+d*R,s[7]=c*m+h*v+d*P,s[2]=f*_+u*w+g*A,s[5]=f*p+u*S+g*R,s[8]=f*m+u*v+g*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*s*h+n*o*l+i*s*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,f=o*l-h*s,u=c*s-a*l,g=t*d+n*f+i*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(i*c-h*n)*_,e[2]=(o*n-i*a)*_,e[3]=f*_,e[4]=(h*t-i*l)*_,e[5]=(i*s-o*t)*_,e[6]=u*_,e[7]=(n*l-c*t)*_,e[8]=(a*t-n*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply($r.makeScale(e,t)),this}rotate(e){return this.premultiply($r.makeRotation(-e)),this}translate(e,t){return this.premultiply($r.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const $r=new Xe;function vh(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Is(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function mu(){const r=Is("canvas");return r.style.display="block",r}const Rl={};function Ds(r){r in Rl||(Rl[r]=!0,console.warn(r))}function gu(r,e,t){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}const Cl=new Xe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pl=new Xe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function _u(){const r={enabled:!0,workingColorSpace:Ht,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ht&&(i.r=Un(i.r),i.g=Un(i.g),i.b=Un(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ht&&(i.r=Hi(i.r),i.g=Hi(i.g),i.b=Hi(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Yn?Or:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Ds("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Ds("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[Ht]:{primaries:e,whitePoint:n,transfer:Or,toXYZ:Cl,fromXYZ:Pl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:lt},outputColorSpaceConfig:{drawingBufferColorSpace:lt}},[lt]:{primaries:e,whitePoint:n,transfer:ht,toXYZ:Cl,fromXYZ:Pl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:lt}}}),r}const je=_u();function Un(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Hi(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let _i;class vu{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{_i===void 0&&(_i=Is("canvas")),_i.width=e.width,_i.height=e.height;const i=_i.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=_i}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Is("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=Un(s[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Un(t[n]/255)*255):t[n]=Un(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let xu=0;class Ko{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xu++}),this.uuid=sn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(Jr(i[a].image)):s.push(Jr(i[a]))}else s=Jr(i);n.url=s}return t||(e.images[this.uuid]=n),n}}function Jr(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?vu.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Su=0;const jr=new E;class At extends ji{constructor(e=At.DEFAULT_IMAGE,t=At.DEFAULT_MAPPING,n=Kn,i=Kn,s=Zt,a=In,o=nn,l=vn,c=At.DEFAULT_ANISOTROPY,h=Yn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Su++}),this.uuid=sn(),this.name="",this.source=new Ko(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new le(0,0),this.repeat=new le(1,1),this.center=new le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(jr).x}get height(){return this.source.getSize(jr).y}get depth(){return this.source.getSize(jr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ah)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Xi:e.x=e.x-Math.floor(e.x);break;case Kn:e.x=e.x<0?0:1;break;case Nr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Xi:e.y=e.y-Math.floor(e.y);break;case Kn:e.y=e.y<0?0:1;break;case Nr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}At.DEFAULT_IMAGE=null;At.DEFAULT_MAPPING=ah;At.DEFAULT_ANISOTROPY=1;class it{constructor(e=0,t=0,n=0,i=1){it.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,s;const l=e.elements,c=l[0],h=l[4],d=l[8],f=l[1],u=l[5],g=l[9],_=l[2],p=l[6],m=l[10];if(Math.abs(h-f)<.01&&Math.abs(d-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+u+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(c+1)/2,v=(u+1)/2,A=(m+1)/2,R=(h+f)/4,P=(d+_)/4,C=(g+p)/4;return S>v&&S>A?S<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(S),i=R/n,s=P/n):v>A?v<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(v),n=R/i,s=C/i):A<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(A),n=P/s,i=C/s),this.set(n,i,s,t),this}let w=Math.sqrt((p-g)*(p-g)+(d-_)*(d-_)+(f-h)*(f-h));return Math.abs(w)<.001&&(w=1),this.x=(p-g)/w,this.y=(d-_)/w,this.z=(f-h)/w,this.w=Math.acos((c+u+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ye(this.x,e.x,t.x),this.y=Ye(this.y,e.y,t.y),this.z=Ye(this.z,e.z,t.z),this.w=Ye(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ye(this.x,e,t),this.y=Ye(this.y,e,t),this.z=Ye(this.z,e,t),this.w=Ye(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ye(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class yu extends ji{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Zt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new it(0,0,e,t),this.scissorTest=!1,this.viewport=new it(0,0,e,t);const i={width:e,height:t,depth:n.depth},s=new At(i);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:Zt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Ko(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Jn extends yu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class xh extends At{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Mu extends At{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Be{constructor(e=new E(1/0,1/0,1/0),t=new E(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(rn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(rn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=rn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,rn):rn.fromBufferAttribute(s,a),rn.applyMatrix4(e.matrixWorld),this.expandByPoint(rn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),qs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),qs.copy(n.boundingBox)),qs.applyMatrix4(e.matrixWorld),this.union(qs)}const i=e.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,rn),rn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(rs),Ys.subVectors(this.max,rs),vi.subVectors(e.a,rs),xi.subVectors(e.b,rs),Si.subVectors(e.c,rs),kn.subVectors(xi,vi),Hn.subVectors(Si,xi),ti.subVectors(vi,Si);let t=[0,-kn.z,kn.y,0,-Hn.z,Hn.y,0,-ti.z,ti.y,kn.z,0,-kn.x,Hn.z,0,-Hn.x,ti.z,0,-ti.x,-kn.y,kn.x,0,-Hn.y,Hn.x,0,-ti.y,ti.x,0];return!Qr(t,vi,xi,Si,Ys)||(t=[1,0,0,0,1,0,0,0,1],!Qr(t,vi,xi,Si,Ys))?!1:(Ks.crossVectors(kn,Hn),t=[Ks.x,Ks.y,Ks.z],Qr(t,vi,xi,Si,Ys))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,rn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(rn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Tn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Tn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Tn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Tn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Tn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Tn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Tn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Tn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Tn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Tn=[new E,new E,new E,new E,new E,new E,new E,new E],rn=new E,qs=new Be,vi=new E,xi=new E,Si=new E,kn=new E,Hn=new E,ti=new E,rs=new E,Ys=new E,Ks=new E,ni=new E;function Qr(r,e,t,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){ni.fromArray(r,s);const o=i.x*Math.abs(ni.x)+i.y*Math.abs(ni.y)+i.z*Math.abs(ni.z),l=e.dot(ni),c=t.dot(ni),h=n.dot(ni);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Eu=new Be,as=new E,ea=new E;class Sn{constructor(e=new E,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Eu.setFromPoints(e).getCenter(n);let i=0;for(let s=0,a=e.length;s<a;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;as.subVectors(e,this.center);const t=as.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(as,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ea.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(as.copy(e.center).add(ea)),this.expandByPoint(as.copy(e.center).sub(ea))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const wn=new E,ta=new E,Zs=new E,zn=new E,na=new E,$s=new E,ia=new E;class Hs{constructor(e=new E,t=new E(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,wn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=wn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(wn.copy(this.origin).addScaledVector(this.direction,t),wn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ta.copy(e).add(t).multiplyScalar(.5),Zs.copy(t).sub(e).normalize(),zn.copy(this.origin).sub(ta);const s=e.distanceTo(t)*.5,a=-this.direction.dot(Zs),o=zn.dot(this.direction),l=-zn.dot(Zs),c=zn.lengthSq(),h=Math.abs(1-a*a);let d,f,u,g;if(h>0)if(d=a*l-o,f=a*o-l,g=s*h,d>=0)if(f>=-g)if(f<=g){const _=1/h;d*=_,f*=_,u=d*(d+a*f+2*o)+f*(a*d+f+2*l)+c}else f=s,d=Math.max(0,-(a*f+o)),u=-d*d+f*(f+2*l)+c;else f=-s,d=Math.max(0,-(a*f+o)),u=-d*d+f*(f+2*l)+c;else f<=-g?(d=Math.max(0,-(-a*s+o)),f=d>0?-s:Math.min(Math.max(-s,-l),s),u=-d*d+f*(f+2*l)+c):f<=g?(d=0,f=Math.min(Math.max(-s,-l),s),u=f*(f+2*l)+c):(d=Math.max(0,-(a*s+o)),f=d>0?s:Math.min(Math.max(-s,-l),s),u=-d*d+f*(f+2*l)+c);else f=a>0?-s:s,d=Math.max(0,-(a*f+o)),u=-d*d+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(ta).addScaledVector(Zs,f),u}intersectSphere(e,t){wn.subVectors(e.center,this.origin);const n=wn.dot(this.direction),i=wn.dot(wn)-n*n,s=e.radius*e.radius;if(i>s)return null;const a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),h>=0?(s=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(s=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),d>=0?(o=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,wn)!==null}intersectTriangle(e,t,n,i,s){na.subVectors(t,e),$s.subVectors(n,e),ia.crossVectors(na,$s);let a=this.direction.dot(ia),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;zn.subVectors(this.origin,e);const l=o*this.direction.dot($s.crossVectors(zn,$s));if(l<0)return null;const c=o*this.direction.dot(na.cross(zn));if(c<0||l+c>a)return null;const h=-o*zn.dot(ia);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class He{constructor(e,t,n,i,s,a,o,l,c,h,d,f,u,g,_,p){He.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,s,a,o,l,c,h,d,f,u,g,_,p)}set(e,t,n,i,s,a,o,l,c,h,d,f,u,g,_,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=s,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=f,m[3]=u,m[7]=g,m[11]=_,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new He().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/yi.setFromMatrixColumn(e,0).length(),s=1/yi.setFromMatrixColumn(e,1).length(),a=1/yi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const f=a*h,u=a*d,g=o*h,_=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=u+g*c,t[5]=f-_*c,t[9]=-o*l,t[2]=_-f*c,t[6]=g+u*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*h,u=l*d,g=c*h,_=c*d;t[0]=f+_*o,t[4]=g*o-u,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=u*o-g,t[6]=_+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*h,u=l*d,g=c*h,_=c*d;t[0]=f-_*o,t[4]=-a*d,t[8]=g+u*o,t[1]=u+g*o,t[5]=a*h,t[9]=_-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*h,u=a*d,g=o*h,_=o*d;t[0]=l*h,t[4]=g*c-u,t[8]=f*c+_,t[1]=l*d,t[5]=_*c+f,t[9]=u*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,u=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=_-f*d,t[8]=g*d+u,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=u*d+g,t[10]=f-_*d}else if(e.order==="XZY"){const f=a*l,u=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=f*d+_,t[5]=a*h,t[9]=u*d-g,t[2]=g*d-u,t[6]=o*h,t[10]=_*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Tu,e,wu)}lookAt(e,t,n){const i=this.elements;return qt.subVectors(e,t),qt.lengthSq()===0&&(qt.z=1),qt.normalize(),Vn.crossVectors(n,qt),Vn.lengthSq()===0&&(Math.abs(n.z)===1?qt.x+=1e-4:qt.z+=1e-4,qt.normalize(),Vn.crossVectors(n,qt)),Vn.normalize(),Js.crossVectors(qt,Vn),i[0]=Vn.x,i[4]=Js.x,i[8]=qt.x,i[1]=Vn.y,i[5]=Js.y,i[9]=qt.y,i[2]=Vn.z,i[6]=Js.z,i[10]=qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],f=n[9],u=n[13],g=n[2],_=n[6],p=n[10],m=n[14],w=n[3],S=n[7],v=n[11],A=n[15],R=i[0],P=i[4],C=i[8],M=i[12],y=i[1],L=i[5],U=i[9],B=i[13],W=i[2],z=i[6],X=i[10],Z=i[14],V=i[3],ne=i[7],pe=i[11],xe=i[15];return s[0]=a*R+o*y+l*W+c*V,s[4]=a*P+o*L+l*z+c*ne,s[8]=a*C+o*U+l*X+c*pe,s[12]=a*M+o*B+l*Z+c*xe,s[1]=h*R+d*y+f*W+u*V,s[5]=h*P+d*L+f*z+u*ne,s[9]=h*C+d*U+f*X+u*pe,s[13]=h*M+d*B+f*Z+u*xe,s[2]=g*R+_*y+p*W+m*V,s[6]=g*P+_*L+p*z+m*ne,s[10]=g*C+_*U+p*X+m*pe,s[14]=g*M+_*B+p*Z+m*xe,s[3]=w*R+S*y+v*W+A*V,s[7]=w*P+S*L+v*z+A*ne,s[11]=w*C+S*U+v*X+A*pe,s[15]=w*M+S*B+v*Z+A*xe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],f=e[10],u=e[14],g=e[3],_=e[7],p=e[11],m=e[15];return g*(+s*l*d-i*c*d-s*o*f+n*c*f+i*o*u-n*l*u)+_*(+t*l*u-t*c*f+s*a*f-i*a*u+i*c*h-s*l*h)+p*(+t*c*d-t*o*u-s*a*d+n*a*u+s*o*h-n*c*h)+m*(-i*o*h-t*l*d+t*o*f+i*a*d-n*a*f+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],f=e[10],u=e[11],g=e[12],_=e[13],p=e[14],m=e[15],w=d*p*c-_*f*c+_*l*u-o*p*u-d*l*m+o*f*m,S=g*f*c-h*p*c-g*l*u+a*p*u+h*l*m-a*f*m,v=h*_*c-g*d*c+g*o*u-a*_*u-h*o*m+a*d*m,A=g*d*l-h*_*l-g*o*f+a*_*f+h*o*p-a*d*p,R=t*w+n*S+i*v+s*A;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/R;return e[0]=w*P,e[1]=(_*f*s-d*p*s-_*i*u+n*p*u+d*i*m-n*f*m)*P,e[2]=(o*p*s-_*l*s+_*i*c-n*p*c-o*i*m+n*l*m)*P,e[3]=(d*l*s-o*f*s-d*i*c+n*f*c+o*i*u-n*l*u)*P,e[4]=S*P,e[5]=(h*p*s-g*f*s+g*i*u-t*p*u-h*i*m+t*f*m)*P,e[6]=(g*l*s-a*p*s-g*i*c+t*p*c+a*i*m-t*l*m)*P,e[7]=(a*f*s-h*l*s+h*i*c-t*f*c-a*i*u+t*l*u)*P,e[8]=v*P,e[9]=(g*d*s-h*_*s-g*n*u+t*_*u+h*n*m-t*d*m)*P,e[10]=(a*_*s-g*o*s+g*n*c-t*_*c-a*n*m+t*o*m)*P,e[11]=(h*o*s-a*d*s-h*n*c+t*d*c+a*n*u-t*o*u)*P,e[12]=A*P,e[13]=(h*_*i-g*d*i+g*n*f-t*_*f-h*n*p+t*d*p)*P,e[14]=(g*o*i-a*_*i-g*n*l+t*_*l+a*n*p-t*o*p)*P,e[15]=(a*d*i-h*o*i+h*n*l-t*d*l-a*n*f+t*o*f)*P,this}scale(e){const t=this.elements,n=e.x,i=e.y,s=e.z;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),s=1-n,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,a){return this.set(1,n,s,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,d=o+o,f=s*c,u=s*h,g=s*d,_=a*h,p=a*d,m=o*d,w=l*c,S=l*h,v=l*d,A=n.x,R=n.y,P=n.z;return i[0]=(1-(_+m))*A,i[1]=(u+v)*A,i[2]=(g-S)*A,i[3]=0,i[4]=(u-v)*R,i[5]=(1-(f+m))*R,i[6]=(p+w)*R,i[7]=0,i[8]=(g+S)*P,i[9]=(p-w)*P,i[10]=(1-(f+_))*P,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let s=yi.set(i[0],i[1],i[2]).length();const a=yi.set(i[4],i[5],i[6]).length(),o=yi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),e.x=i[12],e.y=i[13],e.z=i[14],an.copy(this);const c=1/s,h=1/a,d=1/o;return an.elements[0]*=c,an.elements[1]*=c,an.elements[2]*=c,an.elements[4]*=h,an.elements[5]*=h,an.elements[6]*=h,an.elements[8]*=d,an.elements[9]*=d,an.elements[10]*=d,t.setFromRotationMatrix(an),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,a,o=gn,l=!1){const c=this.elements,h=2*s/(t-e),d=2*s/(n-i),f=(t+e)/(t-e),u=(n+i)/(n-i);let g,_;if(l)g=s/(a-s),_=a*s/(a-s);else if(o===gn)g=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===Ur)g=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,s,a,o=gn,l=!1){const c=this.elements,h=2/(t-e),d=2/(n-i),f=-(t+e)/(t-e),u=-(n+i)/(n-i);let g,_;if(l)g=1/(a-s),_=a/(a-s);else if(o===gn)g=-2/(a-s),_=-(a+s)/(a-s);else if(o===Ur)g=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=d,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const yi=new E,an=new He,Tu=new E(0,0,0),wu=new E(1,1,1),Vn=new E,Js=new E,qt=new E,Ll=new He,Il=new Bn;class xn{constructor(e=0,t=0,n=0,i=xn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],d=i[2],f=i[6],u=i[10];switch(t){case"XYZ":this._y=Math.asin(Ye(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ye(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ye(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,u),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ye(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,u),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ye(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-Ye(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ll.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ll,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Il.setFromEuler(this),this.setFromQuaternion(Il,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xn.DEFAULT_ORDER="XYZ";class Zo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let bu=0;const Dl=new E,Mi=new Bn,bn=new He,js=new E,os=new E,Au=new E,Ru=new Bn,Nl=new E(1,0,0),Ol=new E(0,1,0),Ul=new E(0,0,1),Fl={type:"added"},Cu={type:"removed"},Ei={type:"childadded",child:null},sa={type:"childremoved",child:null};class gt extends ji{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:bu++}),this.uuid=sn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=gt.DEFAULT_UP.clone();const e=new E,t=new xn,n=new Bn,i=new E(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new He},normalMatrix:{value:new Xe}}),this.matrix=new He,this.matrixWorld=new He,this.matrixAutoUpdate=gt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Zo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.premultiply(Mi),this}rotateX(e){return this.rotateOnAxis(Nl,e)}rotateY(e){return this.rotateOnAxis(Ol,e)}rotateZ(e){return this.rotateOnAxis(Ul,e)}translateOnAxis(e,t){return Dl.copy(e).applyQuaternion(this.quaternion),this.position.add(Dl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Nl,e)}translateY(e){return this.translateOnAxis(Ol,e)}translateZ(e){return this.translateOnAxis(Ul,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(bn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?js.copy(e):js.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?bn.lookAt(os,js,this.up):bn.lookAt(js,os,this.up),this.quaternion.setFromRotationMatrix(bn),i&&(bn.extractRotation(i.matrixWorld),Mi.setFromRotationMatrix(bn),this.quaternion.premultiply(Mi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fl),Ei.child=e,this.dispatchEvent(Ei),Ei.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Cu),sa.child=e,this.dispatchEvent(sa),sa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),bn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),bn.multiply(e.parent.matrixWorld)),e.applyMatrix4(bn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fl),Ei.child=e,this.dispatchEvent(Ei),Ei.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,e,Au),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,Ru,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));i.material=o}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),f=a(e.skeletons),u=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),u.length>0&&(n.animations=u),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}gt.DEFAULT_UP=new E(0,1,0);gt.DEFAULT_MATRIX_AUTO_UPDATE=!0;gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const on=new E,An=new E,ra=new E,Rn=new E,Ti=new E,wi=new E,Bl=new E,aa=new E,oa=new E,la=new E,ca=new it,ha=new it,da=new it;class tn{constructor(e=new E,t=new E,n=new E){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),on.subVectors(e,t),i.cross(on);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(e,t,n,i,s){on.subVectors(i,t),An.subVectors(n,t),ra.subVectors(e,t);const a=on.dot(on),o=on.dot(An),l=on.dot(ra),c=An.dot(An),h=An.dot(ra),d=a*c-o*o;if(d===0)return s.set(0,0,0),null;const f=1/d,u=(c*l-o*h)*f,g=(a*h-o*l)*f;return s.set(1-u-g,g,u)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Rn)===null?!1:Rn.x>=0&&Rn.y>=0&&Rn.x+Rn.y<=1}static getInterpolation(e,t,n,i,s,a,o,l){return this.getBarycoord(e,t,n,i,Rn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Rn.x),l.addScaledVector(a,Rn.y),l.addScaledVector(o,Rn.z),l)}static getInterpolatedAttribute(e,t,n,i,s,a){return ca.setScalar(0),ha.setScalar(0),da.setScalar(0),ca.fromBufferAttribute(e,t),ha.fromBufferAttribute(e,n),da.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(ca,s.x),a.addScaledVector(ha,s.y),a.addScaledVector(da,s.z),a}static isFrontFacing(e,t,n,i){return on.subVectors(n,t),An.subVectors(e,t),on.cross(An).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return on.subVectors(this.c,this.b),An.subVectors(this.a,this.b),on.cross(An).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return tn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return tn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return tn.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return tn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return tn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,s=this.c;let a,o;Ti.subVectors(i,n),wi.subVectors(s,n),aa.subVectors(e,n);const l=Ti.dot(aa),c=wi.dot(aa);if(l<=0&&c<=0)return t.copy(n);oa.subVectors(e,i);const h=Ti.dot(oa),d=wi.dot(oa);if(h>=0&&d<=h)return t.copy(i);const f=l*d-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Ti,a);la.subVectors(e,s);const u=Ti.dot(la),g=wi.dot(la);if(g>=0&&u<=g)return t.copy(s);const _=u*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(wi,o);const p=h*g-u*d;if(p<=0&&d-h>=0&&u-g>=0)return Bl.subVectors(s,i),o=(d-h)/(d-h+(u-g)),t.copy(i).addScaledVector(Bl,o);const m=1/(p+_+f);return a=_*m,o=f*m,t.copy(n).addScaledVector(Ti,a).addScaledVector(wi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Sh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gn={h:0,s:0,l:0},Qs={h:0,s:0,l:0};function ua(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class Fe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=lt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=je.workingColorSpace){if(e=Yo(e,1),t=Ye(t,0,1),n=Ye(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=ua(a,s,e+1/3),this.g=ua(a,s,e),this.b=ua(a,s,e-1/3)}return je.colorSpaceToWorking(this,i),this}setStyle(e,t=lt){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=lt){const n=Sh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Un(e.r),this.g=Un(e.g),this.b=Un(e.b),this}copyLinearToSRGB(e){return this.r=Hi(e.r),this.g=Hi(e.g),this.b=Hi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=lt){return je.workingToColorSpace(Dt.copy(this),e),Math.round(Ye(Dt.r*255,0,255))*65536+Math.round(Ye(Dt.g*255,0,255))*256+Math.round(Ye(Dt.b*255,0,255))}getHexString(e=lt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.workingToColorSpace(Dt.copy(this),t);const n=Dt.r,i=Dt.g,s=Dt.b,a=Math.max(n,i,s),o=Math.min(n,i,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(i-s)/d+(i<s?6:0);break;case i:l=(s-n)/d+2;break;case s:l=(n-i)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=je.workingColorSpace){return je.workingToColorSpace(Dt.copy(this),t),e.r=Dt.r,e.g=Dt.g,e.b=Dt.b,e}getStyle(e=lt){je.workingToColorSpace(Dt.copy(this),e);const t=Dt.r,n=Dt.g,i=Dt.b;return e!==lt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Gn),this.setHSL(Gn.h+e,Gn.s+t,Gn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Gn),e.getHSL(Qs);const n=Ms(Gn.h,Qs.h,t),i=Ms(Gn.s,Qs.s,t),s=Ms(Gn.l,Qs.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Dt=new Fe;Fe.NAMES=Sh;let Pu=0;class dn extends ji{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Pu++}),this.uuid=sn(),this.name="",this.type="Material",this.blending=ki,this.side=Fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ha,this.blendDst=za,this.blendEquation=hi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Fe(0,0,0),this.blendAlpha=0,this.depthFunc=Vi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Tl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gi,this.stencilZFail=gi,this.stencilZPass=gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ki&&(n.blending=this.blending),this.side!==Fn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ha&&(n.blendSrc=this.blendSrc),this.blendDst!==za&&(n.blendDst=this.blendDst),this.blendEquation!==hi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Vi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Tl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=i(e.textures),a=i(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class bt extends dn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Fe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=rh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Mt=new E,er=new le;let Lu=0;class kt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Lu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ao,this.updateRanges=[],this.gpuType=cn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)er.fromBufferAttribute(this,t),er.applyMatrix3(e),this.setXY(t,er.x,er.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix3(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyMatrix4(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.applyNormalMatrix(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Mt.fromBufferAttribute(this,t),Mt.transformDirection(e),this.setXYZ(t,Mt.x,Mt.y,Mt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ln(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ln(t,this.array)),t}setX(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ln(t,this.array)),t}setY(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ln(t,this.array)),t}setZ(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ln(t,this.array)),t}setW(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array),i=at(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array),i=at(i,this.array),s=at(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ao&&(e.usage=this.usage),e}}class yh extends kt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Mh extends kt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ut extends kt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Iu=0;const Qt=new He,fa=new gt,bi=new E,Yt=new Be,ls=new Be,Pt=new E;class Tt extends ji{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Iu++}),this.uuid=sn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(vh(e)?Mh:yh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Xe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Qt.makeRotationFromQuaternion(e),this.applyMatrix4(Qt),this}rotateX(e){return Qt.makeRotationX(e),this.applyMatrix4(Qt),this}rotateY(e){return Qt.makeRotationY(e),this.applyMatrix4(Qt),this}rotateZ(e){return Qt.makeRotationZ(e),this.applyMatrix4(Qt),this}translate(e,t,n){return Qt.makeTranslation(e,t,n),this.applyMatrix4(Qt),this}scale(e,t,n){return Qt.makeScale(e,t,n),this.applyMatrix4(Qt),this}lookAt(e){return fa.lookAt(e),fa.updateMatrix(),this.applyMatrix4(fa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bi).negate(),this.translate(bi.x,bi.y,bi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,s=e.length;i<s;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ut(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Be);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new E(-1/0,-1/0,-1/0),new E(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const s=t[n];Yt.setFromBufferAttribute(s),this.morphTargetsRelative?(Pt.addVectors(this.boundingBox.min,Yt.min),this.boundingBox.expandByPoint(Pt),Pt.addVectors(this.boundingBox.max,Yt.max),this.boundingBox.expandByPoint(Pt)):(this.boundingBox.expandByPoint(Yt.min),this.boundingBox.expandByPoint(Yt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Sn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new E,1/0);return}if(e){const n=this.boundingSphere.center;if(Yt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];ls.setFromBufferAttribute(o),this.morphTargetsRelative?(Pt.addVectors(Yt.min,ls.min),Yt.expandByPoint(Pt),Pt.addVectors(Yt.max,ls.max),Yt.expandByPoint(Pt)):(Yt.expandByPoint(ls.min),Yt.expandByPoint(ls.max))}Yt.getCenter(n);let i=0;for(let s=0,a=e.count;s<a;s++)Pt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(Pt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Pt.fromBufferAttribute(o,c),l&&(bi.fromBufferAttribute(e,c),Pt.add(bi)),i=Math.max(i,n.distanceToSquared(Pt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new kt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<n.count;C++)o[C]=new E,l[C]=new E;const c=new E,h=new E,d=new E,f=new le,u=new le,g=new le,_=new E,p=new E;function m(C,M,y){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,M),d.fromBufferAttribute(n,y),f.fromBufferAttribute(s,C),u.fromBufferAttribute(s,M),g.fromBufferAttribute(s,y),h.sub(c),d.sub(c),u.sub(f),g.sub(f);const L=1/(u.x*g.y-g.x*u.y);isFinite(L)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-u.y).multiplyScalar(L),p.copy(d).multiplyScalar(u.x).addScaledVector(h,-g.x).multiplyScalar(L),o[C].add(_),o[M].add(_),o[y].add(_),l[C].add(p),l[M].add(p),l[y].add(p))}let w=this.groups;w.length===0&&(w=[{start:0,count:e.count}]);for(let C=0,M=w.length;C<M;++C){const y=w[C],L=y.start,U=y.count;for(let B=L,W=L+U;B<W;B+=3)m(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const S=new E,v=new E,A=new E,R=new E;function P(C){A.fromBufferAttribute(i,C),R.copy(A);const M=o[C];S.copy(M),S.sub(A.multiplyScalar(A.dot(M))).normalize(),v.crossVectors(R,M);const L=v.dot(l[C])<0?-1:1;a.setXYZW(C,S.x,S.y,S.z,L)}for(let C=0,M=w.length;C<M;++C){const y=w[C],L=y.start,U=y.count;for(let B=L,W=L+U;B<W;B+=3)P(e.getX(B+0)),P(e.getX(B+1)),P(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new kt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,u=n.count;f<u;f++)n.setXYZ(f,0,0,0);const i=new E,s=new E,a=new E,o=new E,l=new E,c=new E,h=new E,d=new E;if(e)for(let f=0,u=e.count;f<u;f+=3){const g=e.getX(f+0),_=e.getX(f+1),p=e.getX(f+2);i.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,p),h.subVectors(a,s),d.subVectors(i,s),h.cross(d),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,u=t.count;f<u;f+=3)i.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,s),d.subVectors(i,s),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Pt.fromBufferAttribute(e,t),Pt.normalize(),e.setXYZ(t,Pt.x,Pt.y,Pt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,d=o.normalized,f=new c.constructor(l.length*h);let u=0,g=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?u=l[_]*o.data.stride+o.offset:u=l[_]*h;for(let m=0;m<h;m++)f[g++]=c[u++]}return new kt(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Tt,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,d=c.length;h<d;h++){const f=c[h],u=e(f,n);l.push(u)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,f=c.length;d<f;d++){const u=c[d];h.push(u.toJSON(e.data))}h.length>0&&(i[l]=h,s=!0)}s&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],d=s[c];for(let f=0,u=d.length;f<u;f++)h.push(d[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const kl=new He,ii=new Hs,tr=new Sn,Hl=new E,nr=new E,ir=new E,sr=new E,pa=new E,rr=new E,zl=new E,ar=new E;class Se extends gt{constructor(e=new Tt,t=new bt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(s&&o){rr.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],d=s[l];h!==0&&(pa.fromBufferAttribute(d,e),a?rr.addScaledVector(pa,h):rr.addScaledVector(pa.sub(t),h))}t.add(rr)}return t}raycast(e,t){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),tr.copy(n.boundingSphere),tr.applyMatrix4(s),ii.copy(e.ray).recast(e.near),!(tr.containsPoint(ii.origin)===!1&&(ii.intersectSphere(tr,Hl)===null||ii.origin.distanceToSquared(Hl)>(e.far-e.near)**2))&&(kl.copy(s).invert(),ii.copy(e.ray).applyMatrix4(kl),!(n.boundingBox!==null&&ii.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ii)))}_computeIntersections(e,t,n){let i;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,f=s.groups,u=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],m=a[p.materialIndex],w=Math.max(p.start,u.start),S=Math.min(o.count,Math.min(p.start+p.count,u.start+u.count));for(let v=w,A=S;v<A;v+=3){const R=o.getX(v),P=o.getX(v+1),C=o.getX(v+2);i=or(this,m,e,n,c,h,d,R,P,C),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,u.start),_=Math.min(o.count,u.start+u.count);for(let p=g,m=_;p<m;p+=3){const w=o.getX(p),S=o.getX(p+1),v=o.getX(p+2);i=or(this,a,e,n,c,h,d,w,S,v),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],m=a[p.materialIndex],w=Math.max(p.start,u.start),S=Math.min(l.count,Math.min(p.start+p.count,u.start+u.count));for(let v=w,A=S;v<A;v+=3){const R=v,P=v+1,C=v+2;i=or(this,m,e,n,c,h,d,R,P,C),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const g=Math.max(0,u.start),_=Math.min(l.count,u.start+u.count);for(let p=g,m=_;p<m;p+=3){const w=p,S=p+1,v=p+2;i=or(this,a,e,n,c,h,d,w,S,v),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function Du(r,e,t,n,i,s,a,o){let l;if(e.side===Gt?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,e.side===Fn,o),l===null)return null;ar.copy(o),ar.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo(ar);return c<t.near||c>t.far?null:{distance:c,point:ar.clone(),object:r}}function or(r,e,t,n,i,s,a,o,l,c){r.getVertexPosition(o,nr),r.getVertexPosition(l,ir),r.getVertexPosition(c,sr);const h=Du(r,e,t,n,nr,ir,sr,zl);if(h){const d=new E;tn.getBarycoord(zl,nr,ir,sr,d),i&&(h.uv=tn.getInterpolatedAttribute(i,o,l,c,d,new le)),s&&(h.uv1=tn.getInterpolatedAttribute(s,o,l,c,d,new le)),a&&(h.normal=tn.getInterpolatedAttribute(a,o,l,c,d,new E),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new E,materialIndex:0};tn.getNormal(nr,ir,sr,f.normal),h.face=f,h.barycoord=d}return h}class rt extends Tt{constructor(e=1,t=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};const o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],d=[];let f=0,u=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,s,4),g("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new ut(c,3)),this.setAttribute("normal",new ut(h,3)),this.setAttribute("uv",new ut(d,2));function g(_,p,m,w,S,v,A,R,P,C,M){const y=v/P,L=A/C,U=v/2,B=A/2,W=R/2,z=P+1,X=C+1;let Z=0,V=0;const ne=new E;for(let pe=0;pe<X;pe++){const xe=pe*L-B;for(let ze=0;ze<z;ze++){const Ze=ze*y-U;ne[_]=Ze*w,ne[p]=xe*S,ne[m]=W,c.push(ne.x,ne.y,ne.z),ne[_]=0,ne[p]=0,ne[m]=R>0?1:-1,h.push(ne.x,ne.y,ne.z),d.push(ze/P),d.push(1-pe/C),Z+=1}}for(let pe=0;pe<C;pe++)for(let xe=0;xe<P;xe++){const ze=f+xe+z*pe,Ze=f+xe+z*(pe+1),nt=f+(xe+1)+z*(pe+1),Qe=f+(xe+1)+z*pe;l.push(ze,Ze,Qe),l.push(Ze,nt,Qe),V+=6}o.addGroup(u,V,M),u+=V,f+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Yi(r){const e={};for(const t in r){e[t]={};for(const n in r[t]){const i=r[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Ut(r){const e={};for(let t=0;t<r.length;t++){const n=Yi(r[t]);for(const i in n)e[i]=n[i]}return e}function Nu(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function Eh(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}const Ou={clone:Yi,merge:Ut};var Uu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Fu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class jn extends dn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Uu,this.fragmentShader=Fu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Yi(e.uniforms),this.uniformsGroups=Nu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Th extends gt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new He,this.projectionMatrix=new He,this.projectionMatrixInverse=new He,this.coordinateSystem=gn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Wn=new E,Vl=new le,Gl=new le;class wt extends Th{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=qi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ys*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return qi*2*Math.atan(Math.tan(ys*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Wn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Wn.x,Wn.y).multiplyScalar(-e/Wn.z),Wn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Wn.x,Wn.y).multiplyScalar(-e/Wn.z)}getViewSize(e,t){return this.getViewBounds(e,Vl,Gl),t.subVectors(Gl,Vl)}setViewOffset(e,t,n,i,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ys*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ai=-90,Ri=1;class Bu extends gt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new wt(Ai,Ri,e,t);i.layers=this.layers,this.add(i);const s=new wt(Ai,Ri,e,t);s.layers=this.layers,this.add(s);const a=new wt(Ai,Ri,e,t);a.layers=this.layers,this.add(a);const o=new wt(Ai,Ri,e,t);o.layers=this.layers,this.add(o);const l=new wt(Ai,Ri,e,t);l.layers=this.layers,this.add(l);const c=new wt(Ai,Ri,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===gn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ur)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,s),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(d,f,u),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class wh extends At{constructor(e=[],t=Gi,n,i,s,a,o,l,c,h){super(e,t,n,i,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ku extends Jn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new wh(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new rt(5,5,5),s=new jn({name:"CubemapFromEquirect",uniforms:Yi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Gt,blending:Zn});s.uniforms.tEquirect.value=t;const a=new Se(i,s),o=t.minFilter;return t.minFilter===In&&(t.minFilter=Zt),new Bu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(s)}}class et extends gt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Hu={type:"move"};class ma{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new et,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new et,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new E,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new E),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new et,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new E,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new E),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,n),m=this._getHandJoint(c,_);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=h.position.distanceTo(d.position),u=.02,g=.005;c.inputState.pinching&&f>u+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=u-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Hu)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new et;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class $o{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Fe(e),this.near=t,this.far=n}clone(){return new $o(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class bh extends gt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xn,this.environmentIntensity=1,this.environmentRotation=new xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Ah{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ao,this.updateRanges=[],this.version=0,this.uuid=sn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,s=this.stride;i<s;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=sn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=sn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ot=new E;class Ns{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix4(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyNormalMatrix(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.transformDirection(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=ln(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ln(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ln(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ln(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ln(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array),i=at(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array),i=at(i,this.array),s=at(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return new kt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ns(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Rh extends dn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Fe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Ci;const cs=new E,Pi=new E,Li=new E,Ii=new le,hs=new le,Ch=new He,lr=new E,ds=new E,cr=new E,Wl=new le,ga=new le,Xl=new le;class zu extends gt{constructor(e=new Rh){if(super(),this.isSprite=!0,this.type="Sprite",Ci===void 0){Ci=new Tt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Ah(t,5);Ci.setIndex([0,1,2,0,2,3]),Ci.setAttribute("position",new Ns(n,3,0,!1)),Ci.setAttribute("uv",new Ns(n,2,3,!1))}this.geometry=Ci,this.material=e,this.center=new le(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Pi.setFromMatrixScale(this.matrixWorld),Ch.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Li.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Pi.multiplyScalar(-Li.z);const n=this.material.rotation;let i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));const a=this.center;hr(lr.set(-.5,-.5,0),Li,a,Pi,i,s),hr(ds.set(.5,-.5,0),Li,a,Pi,i,s),hr(cr.set(.5,.5,0),Li,a,Pi,i,s),Wl.set(0,0),ga.set(1,0),Xl.set(1,1);let o=e.ray.intersectTriangle(lr,ds,cr,!1,cs);if(o===null&&(hr(ds.set(-.5,.5,0),Li,a,Pi,i,s),ga.set(0,1),o=e.ray.intersectTriangle(lr,cr,ds,!1,cs),o===null))return;const l=e.ray.origin.distanceTo(cs);l<e.near||l>e.far||t.push({distance:l,point:cs.clone(),uv:tn.getInterpolation(cs,lr,ds,cr,Wl,ga,Xl,new le),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function hr(r,e,t,n,i,s){Ii.subVectors(r,t).addScalar(.5).multiply(n),i!==void 0?(hs.x=s*Ii.x-i*Ii.y,hs.y=i*Ii.x+s*Ii.y):hs.copy(Ii),r.copy(e),r.x+=hs.x,r.y+=hs.y,r.applyMatrix4(Ch)}const ql=new E,Yl=new it,Kl=new it,Vu=new E,Zl=new He,dr=new E,_a=new Sn,$l=new He,va=new Hs;class Gu extends Se{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Sl,this.bindMatrix=new He,this.bindMatrixInverse=new He,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Be),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,dr),this.boundingBox.expandByPoint(dr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Sn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,dr),this.boundingSphere.expandByPoint(dr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_a.copy(this.boundingSphere),_a.applyMatrix4(i),e.ray.intersectsSphere(_a)!==!1&&($l.copy(i).invert(),va.copy(e.ray).applyMatrix4($l),!(this.boundingBox!==null&&va.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,va)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new it,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Sl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Hd?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Yl.fromBufferAttribute(i.attributes.skinIndex,e),Kl.fromBufferAttribute(i.attributes.skinWeight,e),ql.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const a=Kl.getComponent(s);if(a!==0){const o=Yl.getComponent(s);Zl.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Vu.copy(ql).applyMatrix4(Zl),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Ph extends gt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Lh extends At{constructor(e=null,t=1,n=1,i,s,a,o,l,c=Bt,h=Bt,d,f){super(null,a,o,l,c,h,i,s,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Jl=new He,Wu=new He;class Jo{constructor(e=[],t=[]){this.uuid=sn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new He)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new He;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,a=e.length;s<a;s++){const o=e[s]?e[s].matrixWorld:Wu;Jl.multiplyMatrices(o,t[s]),Jl.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Jo(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Lh(t,e,e,nn,cn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const s=e.bones[n];let a=t[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new Ph),this.bones.push(a),this.boneInverses.push(new He().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,s=t.length;i<s;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class Ro extends kt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Di=new He,jl=new He,ur=[],Ql=new Be,Xu=new He,us=new Se,fs=new Sn;class qu extends Se{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ro(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Xu)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Be),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Di),Ql.copy(e.boundingBox).applyMatrix4(Di),this.boundingBox.union(Ql)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Sn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Di),fs.copy(e.boundingSphere).applyMatrix4(Di),this.boundingSphere.union(fs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=e*s+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(us.geometry=this.geometry,us.material=this.material,us.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),fs.copy(this.boundingSphere),fs.applyMatrix4(n),e.ray.intersectsSphere(fs)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,Di),jl.multiplyMatrices(n,Di),us.matrixWorld=jl,us.raycast(e,ur);for(let a=0,o=ur.length;a<o;a++){const l=ur[a];l.instanceId=s,l.object=this,t.push(l)}ur.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ro(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Lh(new Float32Array(i*this.count),i,this.count,Go,cn));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;s[l]=o,s.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const xa=new E,Yu=new E,Ku=new Xe;class li{constructor(e=new E(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=xa.subVectors(n,t).cross(Yu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(xa),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Ku.getNormalMatrix(e),i=this.coplanarPoint(xa).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const si=new Sn,Zu=new le(.5,.5),fr=new E;class jo{constructor(e=new li,t=new li,n=new li,i=new li,s=new li,a=new li){this.planes=[e,t,n,i,s,a]}set(e,t,n,i,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=gn,n=!1){const i=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],h=s[4],d=s[5],f=s[6],u=s[7],g=s[8],_=s[9],p=s[10],m=s[11],w=s[12],S=s[13],v=s[14],A=s[15];if(i[0].setComponents(c-a,u-h,m-g,A-w).normalize(),i[1].setComponents(c+a,u+h,m+g,A+w).normalize(),i[2].setComponents(c+o,u+d,m+_,A+S).normalize(),i[3].setComponents(c-o,u-d,m-_,A-S).normalize(),n)i[4].setComponents(l,f,p,v).normalize(),i[5].setComponents(c-l,u-f,m-p,A-v).normalize();else if(i[4].setComponents(c-l,u-f,m-p,A-v).normalize(),t===gn)i[5].setComponents(c+l,u+f,m+p,A+v).normalize();else if(t===Ur)i[5].setComponents(l,f,p,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),si.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),si.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(si)}intersectsSprite(e){si.center.set(0,0,0);const t=Zu.distanceTo(e.center);return si.radius=.7071067811865476+t,si.applyMatrix4(e.matrixWorld),this.intersectsSphere(si)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(fr.x=i.normal.x>0?e.max.x:e.min.x,fr.y=i.normal.y>0?e.max.y:e.min.y,fr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(fr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Fr extends dn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Fe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Br=new E,kr=new E,ec=new He,ps=new Hs,pr=new Sn,Sa=new E,tc=new E;class Qo extends gt{constructor(e=new Tt,t=new Fr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,s=t.count;i<s;i++)Br.fromBufferAttribute(t,i-1),kr.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Br.distanceTo(kr);e.setAttribute("lineDistance",new ut(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),pr.copy(n.boundingSphere),pr.applyMatrix4(i),pr.radius+=s,e.ray.intersectsSphere(pr)===!1)return;ec.copy(i).invert(),ps.copy(e.ray).applyMatrix4(ec);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const u=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=u,p=g-1;_<p;_+=c){const m=h.getX(_),w=h.getX(_+1),S=mr(this,e,ps,l,m,w,_);S&&t.push(S)}if(this.isLineLoop){const _=h.getX(g-1),p=h.getX(u),m=mr(this,e,ps,l,_,p,g-1);m&&t.push(m)}}else{const u=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let _=u,p=g-1;_<p;_+=c){const m=mr(this,e,ps,l,_,_+1,_);m&&t.push(m)}if(this.isLineLoop){const _=mr(this,e,ps,l,g-1,u,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function mr(r,e,t,n,i,s,a){const o=r.geometry.attributes.position;if(Br.fromBufferAttribute(o,i),kr.fromBufferAttribute(o,s),t.distanceSqToSegment(Br,kr,Sa,tc)>n)return;Sa.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(Sa);if(!(c<e.near||c>e.far))return{distance:c,point:tc.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}const nc=new E,ic=new E;class Co extends Qo{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,s=t.count;i<s;i+=2)nc.fromBufferAttribute(t,i),ic.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+nc.distanceTo(ic);e.setAttribute("lineDistance",new ut(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class $u extends Qo{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Ih extends dn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Fe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const sc=new He,Po=new Hs,gr=new Sn,_r=new E;class Ju extends gt{constructor(e=new Tt,t=new Ih){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),gr.copy(n.boundingSphere),gr.applyMatrix4(i),gr.radius+=s,e.ray.intersectsSphere(gr)===!1)return;sc.copy(i).invert(),Po.copy(e.ray).applyMatrix4(sc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const f=Math.max(0,a.start),u=Math.min(c.count,a.start+a.count);for(let g=f,_=u;g<_;g++){const p=c.getX(g);_r.fromBufferAttribute(d,p),rc(_r,p,l,i,e,t,this)}}else{const f=Math.max(0,a.start),u=Math.min(d.count,a.start+a.count);for(let g=f,_=u;g<_;g++)_r.fromBufferAttribute(d,g),rc(_r,g,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){const o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function rc(r,e,t,n,i,s,a){const o=Po.distanceSqToPoint(r);if(o<t){const l=new E;Po.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Kt extends At{constructor(e,t,n,i,s,a,o,l,c){super(e,t,n,i,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Dh extends At{constructor(e,t,n=ui,i,s,a,o=Bt,l=Bt,c,h=Rs,d=1){if(h!==Rs&&h!==Cs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:d};super(f,i,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ko(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Nh extends At{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class el extends Tt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const s=[],a=[],o=[],l=[],c=new E,h=new le;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,f=3;d<=t;d++,f+=3){const u=n+d/t*i;c.x=e*Math.cos(u),c.y=e*Math.sin(u),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[f]/e+1)/2,h.y=(a[f+1]/e+1)/2,l.push(h.x,h.y)}for(let d=1;d<=t;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new ut(a,3)),this.setAttribute("normal",new ut(o,3)),this.setAttribute("uv",new ut(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new el(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Vt extends Tt{constructor(e=1,t=1,n=1,i=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),s=Math.floor(s);const h=[],d=[],f=[],u=[];let g=0;const _=[],p=n/2;let m=0;w(),a===!1&&(e>0&&S(!0),t>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new ut(d,3)),this.setAttribute("normal",new ut(f,3)),this.setAttribute("uv",new ut(u,2));function w(){const v=new E,A=new E;let R=0;const P=(t-e)/n;for(let C=0;C<=s;C++){const M=[],y=C/s,L=y*(t-e)+e;for(let U=0;U<=i;U++){const B=U/i,W=B*l+o,z=Math.sin(W),X=Math.cos(W);A.x=L*z,A.y=-y*n+p,A.z=L*X,d.push(A.x,A.y,A.z),v.set(z,P,X).normalize(),f.push(v.x,v.y,v.z),u.push(B,1-y),M.push(g++)}_.push(M)}for(let C=0;C<i;C++)for(let M=0;M<s;M++){const y=_[M][C],L=_[M+1][C],U=_[M+1][C+1],B=_[M][C+1];(e>0||M!==0)&&(h.push(y,L,B),R+=3),(t>0||M!==s-1)&&(h.push(L,U,B),R+=3)}c.addGroup(m,R,0),m+=R}function S(v){const A=g,R=new le,P=new E;let C=0;const M=v===!0?e:t,y=v===!0?1:-1;for(let U=1;U<=i;U++)d.push(0,p*y,0),f.push(0,y,0),u.push(.5,.5),g++;const L=g;for(let U=0;U<=i;U++){const W=U/i*l+o,z=Math.cos(W),X=Math.sin(W);P.x=M*X,P.y=p*y,P.z=M*z,d.push(P.x,P.y,P.z),f.push(0,y,0),R.x=z*.5+.5,R.y=X*.5*y+.5,u.push(R.x,R.y),g++}for(let U=0;U<i;U++){const B=A+U,W=L+U;v===!0?h.push(W,W+1,B):h.push(W+1,W,B),C+=3}c.addGroup(m,C,v===!0?1:2),m+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class tl extends Vt{constructor(e=1,t=1,n=32,i=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new tl(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class yn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(i),t.push(s),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const s=n.length;let a;t?a=t:a=e*n[s-1];let o=0,l=s-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(s-1);const h=n[i],f=n[i+1]-h,u=(a-h)/f;return(i+u)/(s-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);const a=this.getPoint(i),o=this.getPoint(s),l=t||(a.isVector2?new le:new E);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new E,i=[],s=[],a=[],o=new E,l=new He;for(let u=0;u<=e;u++){const g=u/e;i[u]=this.getTangentAt(g,new E)}s[0]=new E,a[0]=new E;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),d=Math.abs(i[0].y),f=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),f<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],o),a[0].crossVectors(i[0],s[0]);for(let u=1;u<=e;u++){if(s[u]=s[u-1].clone(),a[u]=a[u-1].clone(),o.crossVectors(i[u-1],i[u]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Ye(i[u-1].dot(i[u]),-1,1));s[u].applyMatrix4(l.makeRotationAxis(o,g))}a[u].crossVectors(i[u],s[u])}if(t===!0){let u=Math.acos(Ye(s[0].dot(s[e]),-1,1));u/=e,i[0].dot(o.crossVectors(s[0],s[e]))>0&&(u=-u);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(i[g],u*g)),a[g].crossVectors(i[g],s[g])}return{tangents:i,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class nl extends yn{constructor(e=0,t=0,n=1,i=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new le){const n=t,i=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(a?s=0:s=i),this.aClockwise===!0&&!a&&(s===i?s=-i:s=s-i);const o=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),f=l-this.aX,u=c-this.aY;l=f*h-u*d+this.aX,c=f*d+u*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class ju extends nl{constructor(e,t,n,i,s,a){super(e,t,n,n,i,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function il(){let r=0,e=0,t=0,n=0;function i(s,a,o,l){r=s,e=o,t=-3*s+3*a-2*o-l,n=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){i(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,d){let f=(a-s)/c-(o-s)/(c+h)+(o-a)/h,u=(o-a)/h-(l-a)/(h+d)+(l-o)/d;f*=h,u*=h,i(a,o,f,u)},calc:function(s){const a=s*s,o=a*s;return r+e*s+t*a+n*o}}}const vr=new E,ya=new il,Ma=new il,Ea=new il;class Qu extends yn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new E){const n=t,i=this.points,s=i.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%s]:(vr.subVectors(i[0],i[1]).add(i[0]),c=vr);const d=i[o%s],f=i[(o+1)%s];if(this.closed||o+2<s?h=i[(o+2)%s]:(vr.subVectors(i[s-1],i[s-2]).add(i[s-1]),h=vr),this.curveType==="centripetal"||this.curveType==="chordal"){const u=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(d),u),_=Math.pow(d.distanceToSquared(f),u),p=Math.pow(f.distanceToSquared(h),u);_<1e-4&&(_=1),g<1e-4&&(g=_),p<1e-4&&(p=_),ya.initNonuniformCatmullRom(c.x,d.x,f.x,h.x,g,_,p),Ma.initNonuniformCatmullRom(c.y,d.y,f.y,h.y,g,_,p),Ea.initNonuniformCatmullRom(c.z,d.z,f.z,h.z,g,_,p)}else this.curveType==="catmullrom"&&(ya.initCatmullRom(c.x,d.x,f.x,h.x,this.tension),Ma.initCatmullRom(c.y,d.y,f.y,h.y,this.tension),Ea.initCatmullRom(c.z,d.z,f.z,h.z,this.tension));return n.set(ya.calc(l),Ma.calc(l),Ea.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new E().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function ac(r,e,t,n,i){const s=(n-e)*.5,a=(i-t)*.5,o=r*r,l=r*o;return(2*t-2*n+s+a)*l+(-3*t+3*n-2*s-a)*o+s*r+t}function ef(r,e){const t=1-r;return t*t*e}function tf(r,e){return 2*(1-r)*r*e}function nf(r,e){return r*r*e}function Es(r,e,t,n){return ef(r,e)+tf(r,t)+nf(r,n)}function sf(r,e){const t=1-r;return t*t*t*e}function rf(r,e){const t=1-r;return 3*t*t*r*e}function af(r,e){return 3*(1-r)*r*r*e}function of(r,e){return r*r*r*e}function Ts(r,e,t,n,i){return sf(r,e)+rf(r,t)+af(r,n)+of(r,i)}class Oh extends yn{constructor(e=new le,t=new le,n=new le,i=new le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new le){const n=t,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Ts(e,i.x,s.x,a.x,o.x),Ts(e,i.y,s.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class lf extends yn{constructor(e=new E,t=new E,n=new E,i=new E){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new E){const n=t,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Ts(e,i.x,s.x,a.x,o.x),Ts(e,i.y,s.y,a.y,o.y),Ts(e,i.z,s.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Uh extends yn{constructor(e=new le,t=new le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new le){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class cf extends yn{constructor(e=new E,t=new E){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new E){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new E){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Fh extends yn{constructor(e=new le,t=new le,n=new le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new le){const n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Es(e,i.x,s.x,a.x),Es(e,i.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class hf extends yn{constructor(e=new E,t=new E,n=new E){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new E){const n=t,i=this.v0,s=this.v1,a=this.v2;return n.set(Es(e,i.x,s.x,a.x),Es(e,i.y,s.y,a.y),Es(e,i.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Bh extends yn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new le){const n=t,i=this.points,s=(i.length-1)*e,a=Math.floor(s),o=s-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],d=i[a>i.length-3?i.length-1:a+2];return n.set(ac(o,l.x,c.x,h.x,d.x),ac(o,l.y,c.y,h.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new le().fromArray(i))}return this}}var Lo=Object.freeze({__proto__:null,ArcCurve:ju,CatmullRomCurve3:Qu,CubicBezierCurve:Oh,CubicBezierCurve3:lf,EllipseCurve:nl,LineCurve:Uh,LineCurve3:cf,QuadraticBezierCurve:Fh,QuadraticBezierCurve3:hf,SplineCurve:Bh});class df extends yn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Lo[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let s=0;for(;s<i.length;){if(i[s]>=n){const a=i[s]-n,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,s=this.curves;i<s.length;i++){const a=s[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new Lo[i.type]().fromJSON(i))}return this}}class oc extends df{constructor(e){super(),this.type="Path",this.currentPoint=new le,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Uh(this.currentPoint.clone(),new le(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const s=new Fh(this.currentPoint.clone(),new le(e,t),new le(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,s,a){const o=new Oh(this.currentPoint.clone(),new le(e,t),new le(n,i),new le(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Bh(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,s,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,s,a),this}absarc(e,t,n,i,s,a){return this.absellipse(e,t,n,n,i,s,a),this}ellipse(e,t,n,i,s,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,s,a,o,l),this}absellipse(e,t,n,i,s,a,o,l){const c=new nl(e,t,n,i,s,a,o,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Qi extends oc{constructor(e){super(e),this.uuid=sn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new oc().fromJSON(i))}return this}}function uf(r,e,t=2){const n=e&&e.length,i=n?e[0]*t:r.length;let s=kh(r,0,i,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c;if(n&&(s=_f(r,e,s,t)),r.length>80*t){o=1/0,l=1/0;let h=-1/0,d=-1/0;for(let f=t;f<i;f+=t){const u=r[f],g=r[f+1];u<o&&(o=u),g<l&&(l=g),u>h&&(h=u),g>d&&(d=g)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return Os(s,a,t,o,l,c,0),a}function kh(r,e,t,n,i){let s;if(i===Rf(r,e,t,n)>0)for(let a=e;a<t;a+=n)s=lc(a/n|0,r[a],r[a+1],s);else for(let a=t-n;a>=e;a-=n)s=lc(a/n|0,r[a],r[a+1],s);return s&&Ki(s,s.next)&&(Fs(s),s=s.next),s}function fi(r,e){if(!r)return r;e||(e=r);let t=r,n;do if(n=!1,!t.steiner&&(Ki(t,t.next)||St(t.prev,t,t.next)===0)){if(Fs(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Os(r,e,t,n,i,s,a){if(!r)return;!a&&s&&Mf(r,n,i,s);let o=r;for(;r.prev!==r.next;){const l=r.prev,c=r.next;if(s?pf(r,n,i,s):ff(r)){e.push(l.i,r.i,c.i),Fs(r),r=c.next,o=c.next;continue}if(r=c,r===o){a?a===1?(r=mf(fi(r),e),Os(r,e,t,n,i,s,2)):a===2&&gf(r,e,t,n,i,s):Os(fi(r),e,t,n,i,s,1);break}}}function ff(r){const e=r.prev,t=r,n=r.next;if(St(e,t,n)>=0)return!1;const i=e.x,s=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(i,s,a),d=Math.min(o,l,c),f=Math.max(i,s,a),u=Math.max(o,l,c);let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=f&&g.y>=d&&g.y<=u&&xs(i,o,s,l,a,c,g.x,g.y)&&St(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function pf(r,e,t,n){const i=r.prev,s=r,a=r.next;if(St(i,s,a)>=0)return!1;const o=i.x,l=s.x,c=a.x,h=i.y,d=s.y,f=a.y,u=Math.min(o,l,c),g=Math.min(h,d,f),_=Math.max(o,l,c),p=Math.max(h,d,f),m=Io(u,g,e,t,n),w=Io(_,p,e,t,n);let S=r.prevZ,v=r.nextZ;for(;S&&S.z>=m&&v&&v.z<=w;){if(S.x>=u&&S.x<=_&&S.y>=g&&S.y<=p&&S!==i&&S!==a&&xs(o,h,l,d,c,f,S.x,S.y)&&St(S.prev,S,S.next)>=0||(S=S.prevZ,v.x>=u&&v.x<=_&&v.y>=g&&v.y<=p&&v!==i&&v!==a&&xs(o,h,l,d,c,f,v.x,v.y)&&St(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;S&&S.z>=m;){if(S.x>=u&&S.x<=_&&S.y>=g&&S.y<=p&&S!==i&&S!==a&&xs(o,h,l,d,c,f,S.x,S.y)&&St(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;v&&v.z<=w;){if(v.x>=u&&v.x<=_&&v.y>=g&&v.y<=p&&v!==i&&v!==a&&xs(o,h,l,d,c,f,v.x,v.y)&&St(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function mf(r,e){let t=r;do{const n=t.prev,i=t.next.next;!Ki(n,i)&&zh(n,t,t.next,i)&&Us(n,i)&&Us(i,n)&&(e.push(n.i,t.i,i.i),Fs(t),Fs(t.next),t=r=i),t=t.next}while(t!==r);return fi(t)}function gf(r,e,t,n,i,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&wf(a,o)){let l=Vh(a,o);a=fi(a,a.next),l=fi(l,l.next),Os(a,e,t,n,i,s,0),Os(l,e,t,n,i,s,0);return}o=o.next}a=a.next}while(a!==r)}function _f(r,e,t,n){const i=[];for(let s=0,a=e.length;s<a;s++){const o=e[s]*n,l=s<a-1?e[s+1]*n:r.length,c=kh(r,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Tf(c))}i.sort(vf);for(let s=0;s<i.length;s++)t=xf(i[s],t);return t}function vf(r,e){let t=r.x-e.x;if(t===0&&(t=r.y-e.y,t===0)){const n=(r.next.y-r.y)/(r.next.x-r.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function xf(r,e){const t=Sf(r,e);if(!t)return e;const n=Vh(t,r);return fi(n,n.next),fi(t,t.next)}function Sf(r,e){let t=e;const n=r.x,i=r.y;let s=-1/0,a;if(Ki(r,t))return t;do{if(Ki(r,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const d=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=n&&d>s&&(s=d,a=t.x<t.next.x?t:t.next,d===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Hh(i<c?n:s,i,l,c,i<c?s:n,i,t.x,t.y)){const d=Math.abs(i-t.y)/(n-t.x);Us(t,r)&&(d<h||d===h&&(t.x>a.x||t.x===a.x&&yf(a,t)))&&(a=t,h=d)}t=t.next}while(t!==o);return a}function yf(r,e){return St(r.prev,r,e.prev)<0&&St(e.next,r,r.next)<0}function Mf(r,e,t,n){let i=r;do i.z===0&&(i.z=Io(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,Ef(i)}function Ef(r){let e,t=1;do{let n=r,i;r=null;let s=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;n=a}s.nextZ=null,t*=2}while(e>1);return r}function Io(r,e,t,n,i){return r=(r-t)*i|0,e=(e-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function Tf(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function Hh(r,e,t,n,i,s,a,o){return(i-a)*(e-o)>=(r-a)*(s-o)&&(r-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(i-a)*(n-o)}function xs(r,e,t,n,i,s,a,o){return!(r===a&&e===o)&&Hh(r,e,t,n,i,s,a,o)}function wf(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!bf(r,e)&&(Us(r,e)&&Us(e,r)&&Af(r,e)&&(St(r.prev,r,e.prev)||St(r,e.prev,e))||Ki(r,e)&&St(r.prev,r,r.next)>0&&St(e.prev,e,e.next)>0)}function St(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function Ki(r,e){return r.x===e.x&&r.y===e.y}function zh(r,e,t,n){const i=Sr(St(r,e,t)),s=Sr(St(r,e,n)),a=Sr(St(t,n,r)),o=Sr(St(t,n,e));return!!(i!==s&&a!==o||i===0&&xr(r,t,e)||s===0&&xr(r,n,e)||a===0&&xr(t,r,n)||o===0&&xr(t,e,n))}function xr(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function Sr(r){return r>0?1:r<0?-1:0}function bf(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&zh(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function Us(r,e){return St(r.prev,r,r.next)<0?St(r,e,r.next)>=0&&St(r,r.prev,e)>=0:St(r,e,r.prev)<0||St(r,r.next,e)<0}function Af(r,e){let t=r,n=!1;const i=(r.x+e.x)/2,s=(r.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&i<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==r);return n}function Vh(r,e){const t=Do(r.i,r.x,r.y),n=Do(e.i,e.x,e.y),i=r.next,s=e.prev;return r.next=e,e.prev=r,t.next=i,i.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function lc(r,e,t,n){const i=Do(r,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Fs(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Do(r,e,t){return{i:r,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Rf(r,e,t,n){let i=0;for(let s=e,a=t-n;s<t;s+=n)i+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return i}class Cf{static triangulate(e,t,n=2){return uf(e,t,n)}}class Fi{static area(e){const t=e.length;let n=0;for(let i=t-1,s=0;s<t;i=s++)n+=e[i].x*e[s].y-e[s].x*e[i].y;return n*.5}static isClockWise(e){return Fi.area(e)<0}static triangulateShape(e,t){const n=[],i=[],s=[];cc(e),hc(n,e);let a=e.length;t.forEach(cc);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,hc(n,t[l]);const o=Cf.triangulate(n,i);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function cc(r){const e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function hc(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}class pi extends Tt{constructor(e=new Qi([new le(.5,.5),new le(-.5,.5),new le(-.5,-.5),new le(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],s=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new ut(i,3)),this.setAttribute("uv",new ut(s,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1;let f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,u=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:u-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,w=t.UVGenerator!==void 0?t.UVGenerator:Pf;let S,v=!1,A,R,P,C;m&&(S=m.getSpacedPoints(h),v=!0,f=!1,A=m.computeFrenetFrames(h,!1),R=new E,P=new E,C=new E),f||(p=0,u=0,g=0,_=0);const M=o.extractPoints(c);let y=M.shape;const L=M.holes;if(!Fi.isClockWise(y)){y=y.reverse();for(let ee=0,J=L.length;ee<J;ee++){const $=L[ee];Fi.isClockWise($)&&(L[ee]=$.reverse())}}function B(ee){const $=10000000000000001e-36;let K=ee[0];for(let he=1;he<=ee.length;he++){const ie=he%ee.length,de=ee[ie],Ve=de.x-K.x,ke=de.y-K.y,b=Ve*Ve+ke*ke,x=Math.max(Math.abs(de.x),Math.abs(de.y),Math.abs(K.x),Math.abs(K.y)),F=$*x*x;if(b<=F){ee.splice(ie,1),he--;continue}K=de}}B(y),L.forEach(B);const W=L.length,z=y;for(let ee=0;ee<W;ee++){const J=L[ee];y=y.concat(J)}function X(ee,J,$){return J||console.error("THREE.ExtrudeGeometry: vec does not exist"),ee.clone().addScaledVector(J,$)}const Z=y.length;function V(ee,J,$){let K,he,ie;const de=ee.x-J.x,Ve=ee.y-J.y,ke=$.x-ee.x,b=$.y-ee.y,x=de*de+Ve*Ve,F=de*b-Ve*ke;if(Math.abs(F)>Number.EPSILON){const G=Math.sqrt(x),Q=Math.sqrt(ke*ke+b*b),q=J.x-Ve/G,Ce=J.y+de/G,ce=$.x-b/Q,be=$.y+ke/Q,Ae=((ce-q)*b-(be-Ce)*ke)/(de*b-Ve*ke);K=q+de*Ae-ee.x,he=Ce+Ve*Ae-ee.y;const se=K*K+he*he;if(se<=2)return new le(K,he);ie=Math.sqrt(se/2)}else{let G=!1;de>Number.EPSILON?ke>Number.EPSILON&&(G=!0):de<-Number.EPSILON?ke<-Number.EPSILON&&(G=!0):Math.sign(Ve)===Math.sign(b)&&(G=!0),G?(K=-Ve,he=de,ie=Math.sqrt(x)):(K=de,he=Ve,ie=Math.sqrt(x/2))}return new le(K/ie,he/ie)}const ne=[];for(let ee=0,J=z.length,$=J-1,K=ee+1;ee<J;ee++,$++,K++)$===J&&($=0),K===J&&(K=0),ne[ee]=V(z[ee],z[$],z[K]);const pe=[];let xe,ze=ne.concat();for(let ee=0,J=W;ee<J;ee++){const $=L[ee];xe=[];for(let K=0,he=$.length,ie=he-1,de=K+1;K<he;K++,ie++,de++)ie===he&&(ie=0),de===he&&(de=0),xe[K]=V($[K],$[ie],$[de]);pe.push(xe),ze=ze.concat(xe)}let Ze;if(p===0)Ze=Fi.triangulateShape(z,L);else{const ee=[],J=[];for(let $=0;$<p;$++){const K=$/p,he=u*Math.cos(K*Math.PI/2),ie=g*Math.sin(K*Math.PI/2)+_;for(let de=0,Ve=z.length;de<Ve;de++){const ke=X(z[de],ne[de],ie);Le(ke.x,ke.y,-he),K===0&&ee.push(ke)}for(let de=0,Ve=W;de<Ve;de++){const ke=L[de];xe=pe[de];const b=[];for(let x=0,F=ke.length;x<F;x++){const G=X(ke[x],xe[x],ie);Le(G.x,G.y,-he),K===0&&b.push(G)}K===0&&J.push(b)}}Ze=Fi.triangulateShape(ee,J)}const nt=Ze.length,Qe=g+_;for(let ee=0;ee<Z;ee++){const J=f?X(y[ee],ze[ee],Qe):y[ee];v?(P.copy(A.normals[0]).multiplyScalar(J.x),R.copy(A.binormals[0]).multiplyScalar(J.y),C.copy(S[0]).add(P).add(R),Le(C.x,C.y,C.z)):Le(J.x,J.y,0)}for(let ee=1;ee<=h;ee++)for(let J=0;J<Z;J++){const $=f?X(y[J],ze[J],Qe):y[J];v?(P.copy(A.normals[ee]).multiplyScalar($.x),R.copy(A.binormals[ee]).multiplyScalar($.y),C.copy(S[ee]).add(P).add(R),Le(C.x,C.y,C.z)):Le($.x,$.y,d/h*ee)}for(let ee=p-1;ee>=0;ee--){const J=ee/p,$=u*Math.cos(J*Math.PI/2),K=g*Math.sin(J*Math.PI/2)+_;for(let he=0,ie=z.length;he<ie;he++){const de=X(z[he],ne[he],K);Le(de.x,de.y,d+$)}for(let he=0,ie=L.length;he<ie;he++){const de=L[he];xe=pe[he];for(let Ve=0,ke=de.length;Ve<ke;Ve++){const b=X(de[Ve],xe[Ve],K);v?Le(b.x,b.y+S[h-1].y,S[h-1].x+$):Le(b.x,b.y,d+$)}}}Y(),te();function Y(){const ee=i.length/3;if(f){let J=0,$=Z*J;for(let K=0;K<nt;K++){const he=Ze[K];we(he[2]+$,he[1]+$,he[0]+$)}J=h+p*2,$=Z*J;for(let K=0;K<nt;K++){const he=Ze[K];we(he[0]+$,he[1]+$,he[2]+$)}}else{for(let J=0;J<nt;J++){const $=Ze[J];we($[2],$[1],$[0])}for(let J=0;J<nt;J++){const $=Ze[J];we($[0]+Z*h,$[1]+Z*h,$[2]+Z*h)}}n.addGroup(ee,i.length/3-ee,0)}function te(){const ee=i.length/3;let J=0;Me(z,J),J+=z.length;for(let $=0,K=L.length;$<K;$++){const he=L[$];Me(he,J),J+=he.length}n.addGroup(ee,i.length/3-ee,1)}function Me(ee,J){let $=ee.length;for(;--$>=0;){const K=$;let he=$-1;he<0&&(he=ee.length-1);for(let ie=0,de=h+p*2;ie<de;ie++){const Ve=Z*ie,ke=Z*(ie+1),b=J+K+Ve,x=J+he+Ve,F=J+he+ke,G=J+K+ke;$e(b,x,F,G)}}}function Le(ee,J,$){l.push(ee),l.push(J),l.push($)}function we(ee,J,$){ft(ee),ft(J),ft($);const K=i.length/3,he=w.generateTopUV(n,i,K-3,K-2,K-1);I(he[0]),I(he[1]),I(he[2])}function $e(ee,J,$,K){ft(ee),ft(J),ft(K),ft(J),ft($),ft(K);const he=i.length/3,ie=w.generateSideWallUV(n,i,he-6,he-3,he-2,he-1);I(ie[0]),I(ie[1]),I(ie[3]),I(ie[1]),I(ie[2]),I(ie[3])}function ft(ee){i.push(l[ee*3+0]),i.push(l[ee*3+1]),i.push(l[ee*3+2])}function I(ee){s.push(ee.x),s.push(ee.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Lf(t,n,e)}static fromJSON(e,t){const n=[];for(let s=0,a=e.shapes.length;s<a;s++){const o=t[e.shapes[s]];n.push(o)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Lo[i.type]().fromJSON(i)),new pi(n,e.options)}}const Pf={generateTopUV:function(r,e,t,n,i){const s=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[i*3],h=e[i*3+1];return[new le(s,a),new le(o,l),new le(c,h)]},generateSideWallUV:function(r,e,t,n,i,s){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],d=e[n*3+2],f=e[i*3],u=e[i*3+1],g=e[i*3+2],_=e[s*3],p=e[s*3+1],m=e[s*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new le(a,1-l),new le(c,1-d),new le(f,1-g),new le(_,1-m)]:[new le(o,1-l),new le(h,1-d),new le(u,1-g),new le(p,1-m)]}};function Lf(r,e,t){if(t.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){const s=r[n];t.shapes.push(s.uuid)}else t.shapes.push(r.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class xt extends Tt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const s=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,d=e/o,f=t/l,u=[],g=[],_=[],p=[];for(let m=0;m<h;m++){const w=m*f-a;for(let S=0;S<c;S++){const v=S*d-s;g.push(v,-w,0),_.push(0,0,1),p.push(S/o),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let w=0;w<o;w++){const S=w+c*m,v=w+c*(m+1),A=w+1+c*(m+1),R=w+1+c*m;u.push(S,v,R),u.push(v,A,R)}this.setIndex(u),this.setAttribute("position",new ut(g,3)),this.setAttribute("normal",new ut(_,3)),this.setAttribute("uv",new ut(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xt(e.width,e.height,e.widthSegments,e.heightSegments)}}class Nn extends Tt{constructor(e=1,t=32,n=16,i=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new E,f=new E,u=[],g=[],_=[],p=[];for(let m=0;m<=n;m++){const w=[],S=m/n;let v=0;m===0&&a===0?v=.5/t:m===n&&l===Math.PI&&(v=-.5/t);for(let A=0;A<=t;A++){const R=A/t;d.x=-e*Math.cos(i+R*s)*Math.sin(a+S*o),d.y=e*Math.cos(a+S*o),d.z=e*Math.sin(i+R*s)*Math.sin(a+S*o),g.push(d.x,d.y,d.z),f.copy(d).normalize(),_.push(f.x,f.y,f.z),p.push(R+v,1-S),w.push(c++)}h.push(w)}for(let m=0;m<n;m++)for(let w=0;w<t;w++){const S=h[m][w+1],v=h[m][w],A=h[m+1][w],R=h[m+1][w+1];(m!==0||a>0)&&u.push(S,v,R),(m!==n-1||l<Math.PI)&&u.push(v,A,R)}this.setIndex(u),this.setAttribute("position",new ut(g,3)),this.setAttribute("normal",new ut(_,3)),this.setAttribute("uv",new ut(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nn(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Bs extends Tt{constructor(e=1,t=.4,n=12,i=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);const a=[],o=[],l=[],c=[],h=new E,d=new E,f=new E;for(let u=0;u<=n;u++)for(let g=0;g<=i;g++){const _=g/i*s,p=u/n*Math.PI*2;d.x=(e+t*Math.cos(p))*Math.cos(_),d.y=(e+t*Math.cos(p))*Math.sin(_),d.z=t*Math.sin(p),o.push(d.x,d.y,d.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),f.subVectors(d,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/i),c.push(u/n)}for(let u=1;u<=n;u++)for(let g=1;g<=i;g++){const _=(i+1)*u+g-1,p=(i+1)*(u-1)+g-1,m=(i+1)*(u-1)+g,w=(i+1)*u+g;a.push(_,p,w),a.push(p,m,w)}this.setIndex(a),this.setAttribute("position",new ut(o,3)),this.setAttribute("normal",new ut(l,3)),this.setAttribute("uv",new ut(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bs(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class ve extends dn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Fe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Fe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=gh,this.normalScale=new le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Mn extends ve{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new le(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ye(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Fe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Fe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Fe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class If extends dn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Gd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Df extends dn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function yr(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function Nf(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function Of(r){function e(i,s){return r[i]-r[s]}const t=r.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function dc(r,e,t){const n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){const o=t[s]*e;for(let l=0;l!==e;++l)i[a++]=r[o+l]}return i}function Gh(r,e,t,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(e.push(s.time),t.push(...a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(e.push(s.time),t.push(a)),s=r[i++];while(s!==void 0)}class zs{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],s=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=s)){const o=t[1];e<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=t[--n-1],e>=s)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let a=0;a!==i;++a)t[a]=n[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Uf extends zs{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:yl,endingEnd:yl}}intervalChanged_(e,t,n){const i=this.parameterPositions;let s=e-2,a=e+1,o=i[s],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ml:s=e,o=2*t-n;break;case El:s=i.length-2,o=t+i[s]-i[s+1];break;default:s=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ml:a=e,l=2*n-t;break;case El:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,u=this._weightNext,g=(n-t)/(i-t),_=g*g,p=_*g,m=-f*p+2*f*_-f*g,w=(1+f)*p+(-1.5-2*f)*_+(-.5+f)*g+1,S=(-1-u)*p+(1.5+u)*_+.5*g,v=u*p-u*_;for(let A=0;A!==o;++A)s[A]=m*a[h+A]+w*a[c+A]+S*a[l+A]+v*a[d+A];return s}}class Ff extends zs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),d=1-h;for(let f=0;f!==o;++f)s[f]=a[c+f]*d+a[l+f]*h;return s}}class Bf extends zs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class un{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=yr(t,this.TimeBufferType),this.values=yr(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:yr(e.times,Array),values:yr(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Bf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ff(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Uf(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ps:t=this.InterpolantFactoryMethodDiscrete;break;case Ls:t=this.InterpolantFactoryMethodLinear;break;case Kr:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ps;case this.InterpolantFactoryMethodLinear:return Ls;case this.InterpolantFactoryMethodSmooth:return Kr}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let s=0,a=i-1;for(;s!==i&&n[s]<e;)++s;for(;a!==-1&&n[a]>t;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);const o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&Nf(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Kr,s=e.length-1;let a=1;for(let o=1;o<s;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{const d=o*n,f=d-n,u=d+n;for(let g=0;g!==n;++g){const _=t[d+g];if(_!==t[f+g]||_!==t[u+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const d=o*n,f=a*n;for(let u=0;u!==n;++u)t[f+u]=t[d+u]}++a}}if(s>0){e[a]=e[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}un.prototype.ValueTypeName="";un.prototype.TimeBufferType=Float32Array;un.prototype.ValueBufferType=Float32Array;un.prototype.DefaultInterpolation=Ls;class es extends un{constructor(e,t,n){super(e,t,n)}}es.prototype.ValueTypeName="bool";es.prototype.ValueBufferType=Array;es.prototype.DefaultInterpolation=Ps;es.prototype.InterpolantFactoryMethodLinear=void 0;es.prototype.InterpolantFactoryMethodSmooth=void 0;class Wh extends un{constructor(e,t,n,i){super(e,t,n,i)}}Wh.prototype.ValueTypeName="color";class Zi extends un{constructor(e,t,n,i){super(e,t,n,i)}}Zi.prototype.ValueTypeName="number";class kf extends zs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let h=c+o;c!==h;c+=4)Bn.slerpFlat(s,0,a,c-o,a,c,l);return s}}class $i extends un{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new kf(this.times,this.values,this.getValueSize(),e)}}$i.prototype.ValueTypeName="quaternion";$i.prototype.InterpolantFactoryMethodSmooth=void 0;class ts extends un{constructor(e,t,n){super(e,t,n)}}ts.prototype.ValueTypeName="string";ts.prototype.ValueBufferType=Array;ts.prototype.DefaultInterpolation=Ps;ts.prototype.InterpolantFactoryMethodLinear=void 0;ts.prototype.InterpolantFactoryMethodSmooth=void 0;class Ji extends un{constructor(e,t,n,i){super(e,t,n,i)}}Ji.prototype.ValueTypeName="vector";class Hf{constructor(e="",t=-1,n=[],i=zd){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=sn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Vf(n[a]).scale(i));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s.userData=JSON.parse(e.userData||"{}"),s}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let s=0,a=n.length;s!==a;++s)t.push(un.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);const h=Of(l);l=dc(l,1,h),c=dc(c,1,h),!i&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new Zi(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(s);if(h&&h.length>1){const d=h[1];let f=i[d];f||(i[d]=f=[]),f.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(d,f,u,g,_){if(u.length!==0){const p=[],m=[];Gh(u,p,m,g),p.length!==0&&_.push(new d(f,p,m))}},i=[],s=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let d=0;d<c.length;d++){const f=c[d].keys;if(!(!f||f.length===0))if(f[0].morphTargets){const u={};let g;for(g=0;g<f.length;g++)if(f[g].morphTargets)for(let _=0;_<f[g].morphTargets.length;_++)u[f[g].morphTargets[_]]=-1;for(const _ in u){const p=[],m=[];for(let w=0;w!==f[g].morphTargets.length;++w){const S=f[g];p.push(S.time),m.push(S.morphTarget===_?1:0)}i.push(new Zi(".morphTargetInfluence["+_+"]",p,m))}l=u.length*a}else{const u=".bones["+t[d].name+"]";n(Ji,u+".position",f,"pos",i),n($i,u+".quaternion",f,"rot",i),n(Ji,u+".scale",f,"scl",i)}}return i.length===0?null:new this(s,l,i,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const s=this.tracks[n];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function zf(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Zi;case"vector":case"vector2":case"vector3":case"vector4":return Ji;case"color":return Wh;case"quaternion":return $i;case"bool":case"boolean":return es;case"string":return ts}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function Vf(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=zf(r.type);if(r.times===void 0){const t=[],n=[];Gh(r.keys,t,n,"value"),r.times=t,r.values=n}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}const On={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class Gf{constructor(e,t,n){const i=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,s===!1&&i.onStart!==void 0&&i.onStart(h,a,o),s=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){const d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=c.length;d<f;d+=2){const u=c[d],g=c[d+1];if(u.global&&(u.lastIndex=0),u.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}}const Wf=new Gf;class ns{constructor(e){this.manager=e!==void 0?e:Wf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}ns.DEFAULT_MATERIAL_NAME="__DEFAULT";const Cn={};class Xf extends Error{constructor(e,t){super(e),this.response=t}}class Xh extends ns{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=On.get(`file:${e}`);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(Cn[e]!==void 0){Cn[e].push({onLoad:t,onProgress:n,onError:i});return}Cn[e]=[],Cn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Cn[e],d=c.body.getReader(),f=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),u=f?parseInt(f):0,g=u!==0;let _=0;const p=new ReadableStream({start(m){w();function w(){d.read().then(({done:S,value:v})=>{if(S)m.close();else{_+=v.byteLength;const A=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:u});for(let R=0,P=h.length;R<P;R++){const C=h[R];C.onProgress&&C.onProgress(A)}m.enqueue(v),w()}},S=>{m.error(S)})}}});return new Response(p)}else throw new Xf(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const d=/charset="?([^;"\s]*)"?/i.exec(o),f=d&&d[1]?d[1].toLowerCase():void 0,u=new TextDecoder(f);return c.arrayBuffer().then(g=>u.decode(g))}}}).then(c=>{On.add(`file:${e}`,c);const h=Cn[e];delete Cn[e];for(let d=0,f=h.length;d<f;d++){const u=h[d];u.onLoad&&u.onLoad(c)}}).catch(c=>{const h=Cn[e];if(h===void 0)throw this.manager.itemError(e),c;delete Cn[e];for(let d=0,f=h.length;d<f;d++){const u=h[d];u.onError&&u.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Ni=new WeakMap;class qf extends ns{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=On.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0);else{let d=Ni.get(a);d===void 0&&(d=[],Ni.set(a,d)),d.push({onLoad:t,onError:i})}return a}const o=Is("img");function l(){h(),t&&t(this);const d=Ni.get(this)||[];for(let f=0;f<d.length;f++){const u=d[f];u.onLoad&&u.onLoad(this)}Ni.delete(this),s.manager.itemEnd(e)}function c(d){h(),i&&i(d),On.remove(`image:${e}`);const f=Ni.get(this)||[];for(let u=0;u<f.length;u++){const g=f[u];g.onError&&g.onError(d)}Ni.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),On.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}}class Yf extends ns{constructor(e){super(e)}load(e,t,n,i){const s=new At,a=new qf(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},n,i),s}}class Vr extends gt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Fe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Kf extends Vr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(gt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Fe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ta=new He,uc=new E,fc=new E;class sl{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new le(512,512),this.mapType=vn,this.map=null,this.mapPass=null,this.matrix=new He,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new jo,this._frameExtents=new le(1,1),this._viewportCount=1,this._viewports=[new it(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;uc.setFromMatrixPosition(e.matrixWorld),t.position.copy(uc),fc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(fc),t.updateMatrixWorld(),Ta.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ta,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ta)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Zf extends sl{constructor(){super(new wt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=qi*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=e.distance||t.far;(n!==t.fov||i!==t.aspect||s!==t.far)&&(t.fov=n,t.aspect=i,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class $f extends Vr{constructor(e,t,n=0,i=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(gt.DEFAULT_UP),this.updateMatrix(),this.target=new gt,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new Zf}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const pc=new He,ms=new E,wa=new E;class Jf extends sl{constructor(){super(new wt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new le(4,2),this._viewportCount=6,this._viewports=[new it(2,1,1,1),new it(0,1,1,1),new it(3,1,1,1),new it(1,1,1,1),new it(3,0,1,1),new it(1,0,1,1)],this._cubeDirections=[new E(1,0,0),new E(-1,0,0),new E(0,0,1),new E(0,0,-1),new E(0,1,0),new E(0,-1,0)],this._cubeUps=[new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,0,1),new E(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),ms.setFromMatrixPosition(e.matrixWorld),n.position.copy(ms),wa.copy(n.position),wa.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(wa),n.updateMatrixWorld(),i.makeTranslation(-ms.x,-ms.y,-ms.z),pc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(pc,n.coordinateSystem,n.reversedDepth)}}class jf extends Vr{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Jf}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Gr extends Th{constructor(e=-1,t=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Qf extends sl{constructor(){super(new Gr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class qh extends Vr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(gt.DEFAULT_UP),this.updateMatrix(),this.target=new gt,this.shadow=new Qf}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class ws{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const ba=new WeakMap;class ep extends ns{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=On.get(`image-bitmap:${e}`);if(a!==void 0){if(s.manager.itemStart(e),a.then){a.then(c=>{if(ba.has(a)===!0)i&&i(ba.get(a)),s.manager.itemError(e),s.manager.itemEnd(e);else return t&&t(c),s.manager.itemEnd(e),c});return}return setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){return On.add(`image-bitmap:${e}`,c),t&&t(c),s.manager.itemEnd(e),c}).catch(function(c){i&&i(c),ba.set(l,c),On.remove(`image-bitmap:${e}`),s.manager.itemError(e),s.manager.itemEnd(e)});On.add(`image-bitmap:${e}`,l),s.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class tp extends wt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class np{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const rl="\\[\\]\\.:\\/",ip=new RegExp("["+rl+"]","g"),al="[^"+rl+"]",sp="[^"+rl.replace("\\.","")+"]",rp=/((?:WC+[\/:])*)/.source.replace("WC",al),ap=/(WCOD+)?/.source.replace("WCOD",sp),op=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",al),lp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",al),cp=new RegExp("^"+rp+ap+op+lp+"$"),hp=["material","materials","bones","map"];class dp{constructor(e,t,n){const i=n||ot.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class ot{constructor(e,t,n){this.path=t,this.parsedPath=n||ot.parseTrackName(t),this.node=ot.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new ot.Composite(e,t,n):new ot(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(ip,"")}static parseTrackName(e){const t=cp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const s=n.nodeName.substring(i+1);hp.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(s){for(let a=0;a<s.length;a++){const o=s[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let s=t.propertyIndex;if(e||(e=ot.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ot.Composite=dp;ot.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ot.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ot.prototype.GetterByBindingType=[ot.prototype._getValue_direct,ot.prototype._getValue_array,ot.prototype._getValue_arrayElement,ot.prototype._getValue_toArray];ot.prototype.SetterByBindingTypeAndVersioning=[[ot.prototype._setValue_direct,ot.prototype._setValue_direct_setNeedsUpdate,ot.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_array,ot.prototype._setValue_array_setNeedsUpdate,ot.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_arrayElement,ot.prototype._setValue_arrayElement_setNeedsUpdate,ot.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ot.prototype._setValue_fromArray,ot.prototype._setValue_fromArray_setNeedsUpdate,ot.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const mc=new He;class Yh{constructor(e,t,n=0,i=1/0){this.ray=new Hs(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Zo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return mc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(mc),this}intersectObject(e,t=!0,n=[]){return No(e,this,n,t),n.sort(gc),n}intersectObjects(e,t=!0,n=[]){for(let i=0,s=e.length;i<s;i++)No(e[i],this,n,t);return n.sort(gc),n}}function gc(r,e){return r.distance-e.distance}function No(r,e,t,n){let i=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const s=r.children;for(let a=0,o=s.length;a<o;a++)No(s[a],e,t,!0)}}function _c(r,e,t,n){const i=up(n);switch(t){case uh:return r*e;case Go:return r*e/i.components*i.byteLength;case Wo:return r*e/i.components*i.byteLength;case ph:return r*e*2/i.components*i.byteLength;case Xo:return r*e*2/i.components*i.byteLength;case fh:return r*e*3/i.components*i.byteLength;case nn:return r*e*4/i.components*i.byteLength;case qo:return r*e*4/i.components*i.byteLength;case Rr:case Cr:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Pr:case Lr:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case ja:case eo:return Math.max(r,16)*Math.max(e,8)/4;case Ja:case Qa:return Math.max(r,8)*Math.max(e,8)/2;case to:case no:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case io:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case so:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case ro:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case ao:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case oo:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case lo:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case co:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case ho:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case uo:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case fo:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case po:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case mo:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case go:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case _o:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case vo:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case xo:case So:case yo:return Math.ceil(r/4)*Math.ceil(e/4)*16;case Mo:case Eo:return Math.ceil(r/4)*Math.ceil(e/4)*8;case To:case wo:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function up(r){switch(r){case vn:case lh:return{byteLength:1,components:1};case bs:case ch:case ks:return{byteLength:2,components:1};case zo:case Vo:return{byteLength:2,components:4};case ui:case Ho:case cn:return{byteLength:4,components:1};case hh:case dh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ko}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ko);function Kh(){let r=null,e=!1,t=null,n=null;function i(s,a){t(s,a),n=r.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=r.requestAnimationFrame(i),e=!0)},stop:function(){r.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){r=s}}}function fp(r){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,d=c.byteLength,f=r.createBuffer();r.bindBuffer(l,f),r.bufferData(l,c,h),o.onUploadCallback();let u;if(c instanceof Float32Array)u=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=r.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=r.HALF_FLOAT:u=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=r.SHORT;else if(c instanceof Uint32Array)u=r.UNSIGNED_INT;else if(c instanceof Int32Array)u=r.INT;else if(c instanceof Int8Array)u=r.BYTE;else if(c instanceof Uint8Array)u=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(r.bindBuffer(c,o),d.length===0)r.bufferSubData(c,0,h);else{d.sort((u,g)=>u.start-g.start);let f=0;for(let u=1;u<d.length;u++){const g=d[f],_=d[u];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,d[f]=_)}d.length=f+1;for(let u=0,g=d.length;u<g;u++){const _=d[u];r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(r.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:s,update:a}}var pp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,mp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,gp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,_p=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,vp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,xp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Sp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,yp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Mp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Ep=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Tp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,wp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ap=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Rp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Cp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Pp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Lp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ip=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Dp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Np=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Op=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Up=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Fp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Bp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,kp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Hp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Vp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Gp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Wp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Xp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,qp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Yp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Kp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Zp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,$p=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Jp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,jp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Qp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,em=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,tm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,nm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,im=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,sm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,rm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,am=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,om=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,cm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,hm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,dm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,um=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,fm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,pm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,mm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,gm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,_m=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Sm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ym=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Mm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Em=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Tm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,wm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Am=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Rm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Pm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Lm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Im=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Dm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Nm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Om=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Um=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Fm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Bm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,km=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Hm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Vm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Gm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Wm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Xm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,qm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ym=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Km=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Zm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,$m=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Jm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,jm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Qm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,eg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,tg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ng=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ig=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,rg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ag=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,og=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,lg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,cg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,hg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,dg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,ug=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const fg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,pg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,gg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_g=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Sg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,yg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Mg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Tg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ag=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Rg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Pg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Ig=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Ng=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Og=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ug=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Bg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Vg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Gg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,qg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qe={alphahash_fragment:pp,alphahash_pars_fragment:mp,alphamap_fragment:gp,alphamap_pars_fragment:_p,alphatest_fragment:vp,alphatest_pars_fragment:xp,aomap_fragment:Sp,aomap_pars_fragment:yp,batching_pars_vertex:Mp,batching_vertex:Ep,begin_vertex:Tp,beginnormal_vertex:wp,bsdfs:bp,iridescence_fragment:Ap,bumpmap_pars_fragment:Rp,clipping_planes_fragment:Cp,clipping_planes_pars_fragment:Pp,clipping_planes_pars_vertex:Lp,clipping_planes_vertex:Ip,color_fragment:Dp,color_pars_fragment:Np,color_pars_vertex:Op,color_vertex:Up,common:Fp,cube_uv_reflection_fragment:Bp,defaultnormal_vertex:kp,displacementmap_pars_vertex:Hp,displacementmap_vertex:zp,emissivemap_fragment:Vp,emissivemap_pars_fragment:Gp,colorspace_fragment:Wp,colorspace_pars_fragment:Xp,envmap_fragment:qp,envmap_common_pars_fragment:Yp,envmap_pars_fragment:Kp,envmap_pars_vertex:Zp,envmap_physical_pars_fragment:am,envmap_vertex:$p,fog_vertex:Jp,fog_pars_vertex:jp,fog_fragment:Qp,fog_pars_fragment:em,gradientmap_pars_fragment:tm,lightmap_pars_fragment:nm,lights_lambert_fragment:im,lights_lambert_pars_fragment:sm,lights_pars_begin:rm,lights_toon_fragment:om,lights_toon_pars_fragment:lm,lights_phong_fragment:cm,lights_phong_pars_fragment:hm,lights_physical_fragment:dm,lights_physical_pars_fragment:um,lights_fragment_begin:fm,lights_fragment_maps:pm,lights_fragment_end:mm,logdepthbuf_fragment:gm,logdepthbuf_pars_fragment:_m,logdepthbuf_pars_vertex:vm,logdepthbuf_vertex:xm,map_fragment:Sm,map_pars_fragment:ym,map_particle_fragment:Mm,map_particle_pars_fragment:Em,metalnessmap_fragment:Tm,metalnessmap_pars_fragment:wm,morphinstance_vertex:bm,morphcolor_vertex:Am,morphnormal_vertex:Rm,morphtarget_pars_vertex:Cm,morphtarget_vertex:Pm,normal_fragment_begin:Lm,normal_fragment_maps:Im,normal_pars_fragment:Dm,normal_pars_vertex:Nm,normal_vertex:Om,normalmap_pars_fragment:Um,clearcoat_normal_fragment_begin:Fm,clearcoat_normal_fragment_maps:Bm,clearcoat_pars_fragment:km,iridescence_pars_fragment:Hm,opaque_fragment:zm,packing:Vm,premultiplied_alpha_fragment:Gm,project_vertex:Wm,dithering_fragment:Xm,dithering_pars_fragment:qm,roughnessmap_fragment:Ym,roughnessmap_pars_fragment:Km,shadowmap_pars_fragment:Zm,shadowmap_pars_vertex:$m,shadowmap_vertex:Jm,shadowmask_pars_fragment:jm,skinbase_vertex:Qm,skinning_pars_vertex:eg,skinning_vertex:tg,skinnormal_vertex:ng,specularmap_fragment:ig,specularmap_pars_fragment:sg,tonemapping_fragment:rg,tonemapping_pars_fragment:ag,transmission_fragment:og,transmission_pars_fragment:lg,uv_pars_fragment:cg,uv_pars_vertex:hg,uv_vertex:dg,worldpos_vertex:ug,background_vert:fg,background_frag:pg,backgroundCube_vert:mg,backgroundCube_frag:gg,cube_vert:_g,cube_frag:vg,depth_vert:xg,depth_frag:Sg,distanceRGBA_vert:yg,distanceRGBA_frag:Mg,equirect_vert:Eg,equirect_frag:Tg,linedashed_vert:wg,linedashed_frag:bg,meshbasic_vert:Ag,meshbasic_frag:Rg,meshlambert_vert:Cg,meshlambert_frag:Pg,meshmatcap_vert:Lg,meshmatcap_frag:Ig,meshnormal_vert:Dg,meshnormal_frag:Ng,meshphong_vert:Og,meshphong_frag:Ug,meshphysical_vert:Fg,meshphysical_frag:Bg,meshtoon_vert:kg,meshtoon_frag:Hg,points_vert:zg,points_frag:Vg,shadow_vert:Gg,shadow_frag:Wg,sprite_vert:Xg,sprite_frag:qg},fe={common:{diffuse:{value:new Fe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xe}},envmap:{envMap:{value:null},envMapRotation:{value:new Xe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xe},normalScale:{value:new le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Fe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Fe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0},uvTransform:{value:new Xe}},sprite:{diffuse:{value:new Fe(16777215)},opacity:{value:1},center:{value:new le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}}},mn={basic:{uniforms:Ut([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:Ut([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new Fe(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:Ut([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new Fe(0)},specular:{value:new Fe(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:Ut([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new Fe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:Ut([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new Fe(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:Ut([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:Ut([fe.points,fe.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:Ut([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:Ut([fe.common,fe.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:Ut([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:Ut([fe.sprite,fe.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Xe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xe}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distanceRGBA:{uniforms:Ut([fe.common,fe.displacementmap,{referencePosition:{value:new E},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distanceRGBA_vert,fragmentShader:qe.distanceRGBA_frag},shadow:{uniforms:Ut([fe.lights,fe.fog,{color:{value:new Fe(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};mn.physical={uniforms:Ut([mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xe},clearcoatNormalScale:{value:new le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xe},sheen:{value:0},sheenColor:{value:new Fe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xe},transmissionSamplerSize:{value:new le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xe},attenuationDistance:{value:0},attenuationColor:{value:new Fe(0)},specularColor:{value:new Fe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xe},anisotropyVector:{value:new le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xe}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};const Mr={r:0,b:0,g:0},ri=new xn,Yg=new He;function Kg(r,e,t,n,i,s,a){const o=new Fe(0);let l=s===!0?0:1,c,h,d=null,f=0,u=null;function g(S){let v=S.isScene===!0?S.background:null;return v&&v.isTexture&&(v=(S.backgroundBlurriness>0?t:e).get(v)),v}function _(S){let v=!1;const A=g(S);A===null?m(o,l):A&&A.isColor&&(m(A,1),v=!0);const R=r.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(r.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function p(S,v){const A=g(v);A&&(A.isCubeTexture||A.mapping===zr)?(h===void 0&&(h=new Se(new rt(1,1,1),new jn({name:"BackgroundCubeMaterial",uniforms:Yi(mn.backgroundCube.uniforms),vertexShader:mn.backgroundCube.vertexShader,fragmentShader:mn.backgroundCube.fragmentShader,side:Gt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,P,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),ri.copy(v.backgroundRotation),ri.x*=-1,ri.y*=-1,ri.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(ri.y*=-1,ri.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Yg.makeRotationFromEuler(ri)),h.material.toneMapped=je.getTransfer(A.colorSpace)!==ht,(d!==A||f!==A.version||u!==r.toneMapping)&&(h.material.needsUpdate=!0,d=A,f=A.version,u=r.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(c===void 0&&(c=new Se(new xt(2,2),new jn({name:"BackgroundMaterial",uniforms:Yi(mn.background.uniforms),vertexShader:mn.background.vertexShader,fragmentShader:mn.background.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=A,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=je.getTransfer(A.colorSpace)!==ht,A.matrixAutoUpdate===!0&&A.updateMatrix(),c.material.uniforms.uvTransform.value.copy(A.matrix),(d!==A||f!==A.version||u!==r.toneMapping)&&(c.material.needsUpdate=!0,d=A,f=A.version,u=r.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function m(S,v){S.getRGB(Mr,Eh(r)),n.buffers.color.setClear(Mr.r,Mr.g,Mr.b,v,a)}function w(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,v=1){o.set(S),l=v,m(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,m(o,l)},render:_,addToRenderList:p,dispose:w}}function Zg(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=f(null);let s=i,a=!1;function o(y,L,U,B,W){let z=!1;const X=d(B,U,L);s!==X&&(s=X,c(s.object)),z=u(y,B,U,W),z&&g(y,B,U,W),W!==null&&e.update(W,r.ELEMENT_ARRAY_BUFFER),(z||a)&&(a=!1,v(y,L,U,B),W!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return r.createVertexArray()}function c(y){return r.bindVertexArray(y)}function h(y){return r.deleteVertexArray(y)}function d(y,L,U){const B=U.wireframe===!0;let W=n[y.id];W===void 0&&(W={},n[y.id]=W);let z=W[L.id];z===void 0&&(z={},W[L.id]=z);let X=z[B];return X===void 0&&(X=f(l()),z[B]=X),X}function f(y){const L=[],U=[],B=[];for(let W=0;W<t;W++)L[W]=0,U[W]=0,B[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:U,attributeDivisors:B,object:y,attributes:{},index:null}}function u(y,L,U,B){const W=s.attributes,z=L.attributes;let X=0;const Z=U.getAttributes();for(const V in Z)if(Z[V].location>=0){const pe=W[V];let xe=z[V];if(xe===void 0&&(V==="instanceMatrix"&&y.instanceMatrix&&(xe=y.instanceMatrix),V==="instanceColor"&&y.instanceColor&&(xe=y.instanceColor)),pe===void 0||pe.attribute!==xe||xe&&pe.data!==xe.data)return!0;X++}return s.attributesNum!==X||s.index!==B}function g(y,L,U,B){const W={},z=L.attributes;let X=0;const Z=U.getAttributes();for(const V in Z)if(Z[V].location>=0){let pe=z[V];pe===void 0&&(V==="instanceMatrix"&&y.instanceMatrix&&(pe=y.instanceMatrix),V==="instanceColor"&&y.instanceColor&&(pe=y.instanceColor));const xe={};xe.attribute=pe,pe&&pe.data&&(xe.data=pe.data),W[V]=xe,X++}s.attributes=W,s.attributesNum=X,s.index=B}function _(){const y=s.newAttributes;for(let L=0,U=y.length;L<U;L++)y[L]=0}function p(y){m(y,0)}function m(y,L){const U=s.newAttributes,B=s.enabledAttributes,W=s.attributeDivisors;U[y]=1,B[y]===0&&(r.enableVertexAttribArray(y),B[y]=1),W[y]!==L&&(r.vertexAttribDivisor(y,L),W[y]=L)}function w(){const y=s.newAttributes,L=s.enabledAttributes;for(let U=0,B=L.length;U<B;U++)L[U]!==y[U]&&(r.disableVertexAttribArray(U),L[U]=0)}function S(y,L,U,B,W,z,X){X===!0?r.vertexAttribIPointer(y,L,U,W,z):r.vertexAttribPointer(y,L,U,B,W,z)}function v(y,L,U,B){_();const W=B.attributes,z=U.getAttributes(),X=L.defaultAttributeValues;for(const Z in z){const V=z[Z];if(V.location>=0){let ne=W[Z];if(ne===void 0&&(Z==="instanceMatrix"&&y.instanceMatrix&&(ne=y.instanceMatrix),Z==="instanceColor"&&y.instanceColor&&(ne=y.instanceColor)),ne!==void 0){const pe=ne.normalized,xe=ne.itemSize,ze=e.get(ne);if(ze===void 0)continue;const Ze=ze.buffer,nt=ze.type,Qe=ze.bytesPerElement,Y=nt===r.INT||nt===r.UNSIGNED_INT||ne.gpuType===Ho;if(ne.isInterleavedBufferAttribute){const te=ne.data,Me=te.stride,Le=ne.offset;if(te.isInstancedInterleavedBuffer){for(let we=0;we<V.locationSize;we++)m(V.location+we,te.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let we=0;we<V.locationSize;we++)p(V.location+we);r.bindBuffer(r.ARRAY_BUFFER,Ze);for(let we=0;we<V.locationSize;we++)S(V.location+we,xe/V.locationSize,nt,pe,Me*Qe,(Le+xe/V.locationSize*we)*Qe,Y)}else{if(ne.isInstancedBufferAttribute){for(let te=0;te<V.locationSize;te++)m(V.location+te,ne.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let te=0;te<V.locationSize;te++)p(V.location+te);r.bindBuffer(r.ARRAY_BUFFER,Ze);for(let te=0;te<V.locationSize;te++)S(V.location+te,xe/V.locationSize,nt,pe,xe*Qe,xe/V.locationSize*te*Qe,Y)}}else if(X!==void 0){const pe=X[Z];if(pe!==void 0)switch(pe.length){case 2:r.vertexAttrib2fv(V.location,pe);break;case 3:r.vertexAttrib3fv(V.location,pe);break;case 4:r.vertexAttrib4fv(V.location,pe);break;default:r.vertexAttrib1fv(V.location,pe)}}}}w()}function A(){C();for(const y in n){const L=n[y];for(const U in L){const B=L[U];for(const W in B)h(B[W].object),delete B[W];delete L[U]}delete n[y]}}function R(y){if(n[y.id]===void 0)return;const L=n[y.id];for(const U in L){const B=L[U];for(const W in B)h(B[W].object),delete B[W];delete L[U]}delete n[y.id]}function P(y){for(const L in n){const U=n[L];if(U[y.id]===void 0)continue;const B=U[y.id];for(const W in B)h(B[W].object),delete B[W];delete U[y.id]}}function C(){M(),a=!0,s!==i&&(s=i,c(s.object))}function M(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:C,resetDefaultState:M,dispose:A,releaseStatesOfGeometry:R,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:p,disableUnusedAttributes:w}}function $g(r,e,t){let n;function i(c){n=c}function s(c,h){r.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,d){d!==0&&(r.drawArraysInstanced(n,c,h,d),t.update(h,n,d))}function o(c,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let u=0;for(let g=0;g<d;g++)u+=h[g];t.update(u,n,1)}function l(c,h,d,f){if(d===0)return;const u=e.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<c.length;g++)a(c[g],h[g],f[g]);else{u.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_]*f[_];t.update(g,n,1)}}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Jg(r,e,t,n){let i;function s(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const P=e.get("EXT_texture_filter_anisotropic");i=r.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(P){return!(P!==nn&&n.convert(P)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const C=P===ks&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==vn&&n.convert(P)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==cn&&!C)}function l(P){if(P==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),u=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),p=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),m=r.getParameter(r.MAX_VERTEX_ATTRIBS),w=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),S=r.getParameter(r.MAX_VARYING_VECTORS),v=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),A=g>0,R=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:u,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:w,maxVaryings:S,maxFragmentUniforms:v,vertexTextures:A,maxSamples:R}}function jg(r){const e=this;let t=null,n=0,i=!1,s=!1;const a=new li,o=new Xe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const u=d.length!==0||f||n!==0||i;return i=f,n=d.length,u},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){t=h(d,f,0)},this.setState=function(d,f,u){const g=d.clippingPlanes,_=d.clipIntersection,p=d.clipShadows,m=r.get(d);if(!i||g===null||g.length===0||s&&!p)s?h(null):c();else{const w=s?0:n,S=w*4;let v=m.clippingState||null;l.value=v,v=h(g,f,S,u);for(let A=0;A!==S;++A)v[A]=t[A];m.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=w}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,f,u,g){const _=d!==null?d.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const m=u+_*4,w=f.matrixWorldInverse;o.getNormalMatrix(w),(p===null||p.length<m)&&(p=new Float32Array(m));for(let S=0,v=u;S!==_;++S,v+=4)a.copy(d[S]).applyMatrix4(w,o),a.normal.toArray(p,v),p[v+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function Qg(r){let e=new WeakMap;function t(a,o){return o===Za?a.mapping=Gi:o===$a&&(a.mapping=Wi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Za||o===$a)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new ku(l.height);return c.fromEquirectangularTexture(r,a),e.set(a,c),a.addEventListener("dispose",i),t(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}const Bi=4,vc=[.125,.215,.35,.446,.526,.582],di=20,Aa=new Gr,xc=new Fe;let Ra=null,Ca=0,Pa=0,La=!1;const ci=(1+Math.sqrt(5))/2,Oi=1/ci,Sc=[new E(-ci,Oi,0),new E(ci,Oi,0),new E(-Oi,0,ci),new E(Oi,0,ci),new E(0,ci,-Oi),new E(0,ci,Oi),new E(-1,1,-1),new E(1,1,-1),new E(-1,1,1),new E(1,1,1)],e0=new E;class yc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,s={}){const{size:a=256,position:o=e0}=s;Ra=this._renderer.getRenderTarget(),Ca=this._renderer.getActiveCubeFace(),Pa=this._renderer.getActiveMipmapLevel(),La=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ec(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ra,Ca,Pa),this._renderer.xr.enabled=La,e.scissorTest=!1,Er(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Gi||e.mapping===Wi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ra=this._renderer.getRenderTarget(),Ca=this._renderer.getActiveCubeFace(),Pa=this._renderer.getActiveMipmapLevel(),La=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Zt,minFilter:Zt,generateMipmaps:!1,type:ks,format:nn,colorSpace:Ht,depthBuffer:!1},i=Mc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Mc(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=t0(s)),this._blurMaterial=n0(s,e,t)}return i}_compileMaterial(e){const t=new Se(this._lodPlanes[0],e);this._renderer.compile(t,Aa)}_sceneToCubeUV(e,t,n,i,s){const l=new wt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,u=d.toneMapping;d.getClearColor(xc),d.toneMapping=$n,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(i),d.clearDepth(),d.setRenderTarget(null));const _=new bt({name:"PMREM.Background",side:Gt,depthWrite:!1,depthTest:!1}),p=new Se(new rt,_);let m=!1;const w=e.background;w?w.isColor&&(_.color.copy(w),e.background=null,m=!0):(_.color.copy(xc),m=!0);for(let S=0;S<6;S++){const v=S%3;v===0?(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[S],s.y,s.z)):v===1?(l.up.set(0,0,c[S]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[S],s.z)):(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[S]));const A=this._cubeSize;Er(i,v*A,S>2?A:0,A,A),d.setRenderTarget(i),m&&d.render(p,l),d.render(e,l)}p.geometry.dispose(),p.material.dispose(),d.toneMapping=u,d.autoClear=f,e.background=w}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Gi||e.mapping===Wi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ec());const s=i?this._cubemapMaterial:this._equirectMaterial,a=new Se(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Er(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Aa)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let s=1;s<i;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Sc[(i-s-1)%Sc.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,i,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",s),this._halfBlur(a,e,n,n,i,"longitudinal",s)}_halfBlur(e,t,n,i,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Se(this._lodPlanes[i],c),f=c.uniforms,u=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*u):2*Math.PI/(2*di-1),_=s/g,p=isFinite(s)?1+Math.floor(h*_):di;p>di&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${di}`);const m=[];let w=0;for(let P=0;P<di;++P){const C=P/_,M=Math.exp(-C*C/2);m.push(M),P===0?w+=M:P<p&&(w+=2*M)}for(let P=0;P<m.length;P++)m[P]=m[P]/w;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=m,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:S}=this;f.dTheta.value=g,f.mipInt.value=S-n;const v=this._sizeLods[i],A=3*v*(i>S-Bi?i-S+Bi:0),R=4*(this._cubeSize-v);Er(t,A,R,3*v,2*v),l.setRenderTarget(t),l.render(d,Aa)}}function t0(r){const e=[],t=[],n=[];let i=r;const s=r-Bi+1+vc.length;for(let a=0;a<s;a++){const o=Math.pow(2,i);t.push(o);let l=1/o;a>r-Bi?l=vc[a-r+Bi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,d=1+c,f=[h,h,d,h,d,d,h,h,d,d,h,d],u=6,g=6,_=3,p=2,m=1,w=new Float32Array(_*g*u),S=new Float32Array(p*g*u),v=new Float32Array(m*g*u);for(let R=0;R<u;R++){const P=R%3*2/3-1,C=R>2?0:-1,M=[P,C,0,P+2/3,C,0,P+2/3,C+1,0,P,C,0,P+2/3,C+1,0,P,C+1,0];w.set(M,_*g*R),S.set(f,p*g*R);const y=[R,R,R,R,R,R];v.set(y,m*g*R)}const A=new Tt;A.setAttribute("position",new kt(w,_)),A.setAttribute("uv",new kt(S,p)),A.setAttribute("faceIndex",new kt(v,m)),e.push(A),i>Bi&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Mc(r,e,t){const n=new Jn(r,e,t);return n.texture.mapping=zr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Er(r,e,t,n,i){r.viewport.set(e,t,n,i),r.scissor.set(e,t,n,i)}function n0(r,e,t){const n=new Float32Array(di),i=new E(0,1,0);return new jn({name:"SphericalGaussianBlur",defines:{n:di,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function Ec(){return new jn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function Tc(){return new jn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function ol(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function i0(r){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Za||l===$a,h=l===Gi||l===Wi;if(c||h){let d=e.get(o);const f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new yc(r)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const u=o.image;return c&&u&&u.height>0||h&&u&&i(u)?(t===null&&(t=new yc(r)),d=c?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",s),d.texture):null}}}return o}function i(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function s0(r){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Ds("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function r0(r,e,t,n){const i={},s=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);f.removeEventListener("dispose",a),delete i[f.id];const u=s.get(f);u&&(e.remove(u),s.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,t.memory.geometries++),f}function l(d){const f=d.attributes;for(const u in f)e.update(f[u],r.ARRAY_BUFFER)}function c(d){const f=[],u=d.index,g=d.attributes.position;let _=0;if(u!==null){const w=u.array;_=u.version;for(let S=0,v=w.length;S<v;S+=3){const A=w[S+0],R=w[S+1],P=w[S+2];f.push(A,R,R,P,P,A)}}else if(g!==void 0){const w=g.array;_=g.version;for(let S=0,v=w.length/3-1;S<v;S+=3){const A=S+0,R=S+1,P=S+2;f.push(A,R,R,P,P,A)}}else return;const p=new(vh(f)?Mh:yh)(f,1);p.version=_;const m=s.get(d);m&&e.remove(m),s.set(d,p)}function h(d){const f=s.get(d);if(f){const u=d.index;u!==null&&f.version<u.version&&c(d)}else c(d);return s.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function a0(r,e,t){let n;function i(f){n=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,u){r.drawElements(n,u,s,f*a),t.update(u,n,1)}function c(f,u,g){g!==0&&(r.drawElementsInstanced(n,u,s,f*a,g),t.update(u,n,g))}function h(f,u,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,s,f,0,g);let p=0;for(let m=0;m<g;m++)p+=u[m];t.update(p,n,1)}function d(f,u,g,_){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<f.length;m++)c(f[m]/a,u[m],_[m]);else{p.multiDrawElementsInstancedWEBGL(n,u,0,s,f,0,_,0,g);let m=0;for(let w=0;w<g;w++)m+=u[w]*_[w];t.update(m,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function o0(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=o*(s/3);break;case r.LINES:t.lines+=o*(s/2);break;case r.LINE_STRIP:t.lines+=o*(s-1);break;case r.LINE_LOOP:t.lines+=o*s;break;case r.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function l0(r,e,t){const n=new WeakMap,i=new it;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==d){let y=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",y)};var u=y;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],w=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),p===!0&&(v=3);let A=o.attributes.position.count*v,R=1;A>e.maxTextureSize&&(R=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const P=new Float32Array(A*R*4*d),C=new xh(P,A,R,d);C.type=cn,C.needsUpdate=!0;const M=v*4;for(let L=0;L<d;L++){const U=m[L],B=w[L],W=S[L],z=A*R*4*L;for(let X=0;X<U.count;X++){const Z=X*M;g===!0&&(i.fromBufferAttribute(U,X),P[z+Z+0]=i.x,P[z+Z+1]=i.y,P[z+Z+2]=i.z,P[z+Z+3]=0),_===!0&&(i.fromBufferAttribute(B,X),P[z+Z+4]=i.x,P[z+Z+5]=i.y,P[z+Z+6]=i.z,P[z+Z+7]=0),p===!0&&(i.fromBufferAttribute(W,X),P[z+Z+8]=i.x,P[z+Z+9]=i.y,P[z+Z+10]=i.z,P[z+Z+11]=W.itemSize===4?i.w:1)}}f={count:d,texture:C,size:new le(A,R)},n.set(o,f),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(r,"morphTargetBaseInfluence",_),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",f.size)}return{update:s}}function c0(r,e,t,n){let i=new WeakMap;function s(l){const c=n.render.frame,h=l.geometry,d=e.get(l,h);if(i.get(d)!==c&&(e.update(d),i.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(t.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,r.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return d}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}const Zh=new At,wc=new Dh(1,1),$h=new xh,Jh=new Mu,jh=new wh,bc=[],Ac=[],Rc=new Float32Array(16),Cc=new Float32Array(9),Pc=new Float32Array(4);function is(r,e,t){const n=r[0];if(n<=0||n>0)return r;const i=e*t;let s=bc[i];if(s===void 0&&(s=new Float32Array(i),bc[i]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(s,o)}return s}function Rt(r,e){if(r.length!==e.length)return!1;for(let t=0,n=r.length;t<n;t++)if(r[t]!==e[t])return!1;return!0}function Ct(r,e){for(let t=0,n=e.length;t<n;t++)r[t]=e[t]}function Wr(r,e){let t=Ac[e];t===void 0&&(t=new Int32Array(e),Ac[e]=t);for(let n=0;n!==e;++n)t[n]=r.allocateTextureUnit();return t}function h0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function d0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;r.uniform2fv(this.addr,e),Ct(t,e)}}function u0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Rt(t,e))return;r.uniform3fv(this.addr,e),Ct(t,e)}}function f0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;r.uniform4fv(this.addr,e),Ct(t,e)}}function p0(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;Pc.set(n),r.uniformMatrix2fv(this.addr,!1,Pc),Ct(t,n)}}function m0(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;Cc.set(n),r.uniformMatrix3fv(this.addr,!1,Cc),Ct(t,n)}}function g0(r,e){const t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;Rc.set(n),r.uniformMatrix4fv(this.addr,!1,Rc),Ct(t,n)}}function _0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function v0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;r.uniform2iv(this.addr,e),Ct(t,e)}}function x0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;r.uniform3iv(this.addr,e),Ct(t,e)}}function S0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;r.uniform4iv(this.addr,e),Ct(t,e)}}function y0(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function M0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;r.uniform2uiv(this.addr,e),Ct(t,e)}}function E0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;r.uniform3uiv(this.addr,e),Ct(t,e)}}function T0(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;r.uniform4uiv(this.addr,e),Ct(t,e)}}function w0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(wc.compareFunction=_h,s=wc):s=Zh,t.setTexture2D(e||s,i)}function b0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Jh,i)}function A0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||jh,i)}function R0(r,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||$h,i)}function C0(r){switch(r){case 5126:return h0;case 35664:return d0;case 35665:return u0;case 35666:return f0;case 35674:return p0;case 35675:return m0;case 35676:return g0;case 5124:case 35670:return _0;case 35667:case 35671:return v0;case 35668:case 35672:return x0;case 35669:case 35673:return S0;case 5125:return y0;case 36294:return M0;case 36295:return E0;case 36296:return T0;case 35678:case 36198:case 36298:case 36306:case 35682:return w0;case 35679:case 36299:case 36307:return b0;case 35680:case 36300:case 36308:case 36293:return A0;case 36289:case 36303:case 36311:case 36292:return R0}}function P0(r,e){r.uniform1fv(this.addr,e)}function L0(r,e){const t=is(e,this.size,2);r.uniform2fv(this.addr,t)}function I0(r,e){const t=is(e,this.size,3);r.uniform3fv(this.addr,t)}function D0(r,e){const t=is(e,this.size,4);r.uniform4fv(this.addr,t)}function N0(r,e){const t=is(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function O0(r,e){const t=is(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function U0(r,e){const t=is(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function F0(r,e){r.uniform1iv(this.addr,e)}function B0(r,e){r.uniform2iv(this.addr,e)}function k0(r,e){r.uniform3iv(this.addr,e)}function H0(r,e){r.uniform4iv(this.addr,e)}function z0(r,e){r.uniform1uiv(this.addr,e)}function V0(r,e){r.uniform2uiv(this.addr,e)}function G0(r,e){r.uniform3uiv(this.addr,e)}function W0(r,e){r.uniform4uiv(this.addr,e)}function X0(r,e,t){const n=this.cache,i=e.length,s=Wr(t,i);Rt(n,s)||(r.uniform1iv(this.addr,s),Ct(n,s));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||Zh,s[a])}function q0(r,e,t){const n=this.cache,i=e.length,s=Wr(t,i);Rt(n,s)||(r.uniform1iv(this.addr,s),Ct(n,s));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Jh,s[a])}function Y0(r,e,t){const n=this.cache,i=e.length,s=Wr(t,i);Rt(n,s)||(r.uniform1iv(this.addr,s),Ct(n,s));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||jh,s[a])}function K0(r,e,t){const n=this.cache,i=e.length,s=Wr(t,i);Rt(n,s)||(r.uniform1iv(this.addr,s),Ct(n,s));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||$h,s[a])}function Z0(r){switch(r){case 5126:return P0;case 35664:return L0;case 35665:return I0;case 35666:return D0;case 35674:return N0;case 35675:return O0;case 35676:return U0;case 5124:case 35670:return F0;case 35667:case 35671:return B0;case 35668:case 35672:return k0;case 35669:case 35673:return H0;case 5125:return z0;case 36294:return V0;case 36295:return G0;case 36296:return W0;case 35678:case 36198:case 36298:case 36306:case 35682:return X0;case 35679:case 36299:case 36307:return q0;case 35680:case 36300:case 36308:case 36293:return Y0;case 36289:case 36303:case 36311:case 36292:return K0}}class $0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=C0(t.type)}}class J0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Z0(t.type)}}class j0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let s=0,a=i.length;s!==a;++s){const o=i[s];o.setValue(e,t[o.id],n)}}}const Ia=/(\w+)(\])?(\[|\.)?/g;function Lc(r,e){r.seq.push(e),r.map[e.id]=e}function Q0(r,e,t){const n=r.name,i=n.length;for(Ia.lastIndex=0;;){const s=Ia.exec(n),a=Ia.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){Lc(t,c===void 0?new $0(o,r,e):new J0(o,r,e));break}else{let d=t.map[o];d===void 0&&(d=new j0(o),Lc(t,d)),t=d}}}class Ir{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=e.getActiveUniform(t,i),a=e.getUniformLocation(t,s.name);Q0(s,a,this)}}setValue(e,t,n,i){const s=this.map[t];s!==void 0&&s.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,s=e.length;i!==s;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function Ic(r,e,t){const n=r.createShader(e);return r.shaderSource(n,t),r.compileShader(n),n}const e_=37297;let t_=0;function n_(r,e){const t=r.split(`
`),n=[],i=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=i;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Dc=new Xe;function i_(r){je._getMatrix(Dc,je.workingColorSpace,r);const e=`mat3( ${Dc.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(r)){case Or:return[e,"LinearTransferOETF"];case ht:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function Nc(r,e,t){const n=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(n&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+s+`

`+n_(r.getShaderSource(e),o)}else return s}function s_(r,e){const t=i_(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function r_(r,e){let t;switch(e){case Dd:t="Linear";break;case Nd:t="Reinhard";break;case Od:t="Cineon";break;case Ud:t="ACESFilmic";break;case Bd:t="AgX";break;case kd:t="Neutral";break;case Fd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Tr=new E;function a_(){je.getLuminanceCoefficients(Tr);const r=Tr.x.toFixed(4),e=Tr.y.toFixed(4),t=Tr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function o_(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ss).join(`
`)}function l_(r){const e=[];for(const t in r){const n=r[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function c_(r,e){const t={},n=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(e,i),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function Ss(r){return r!==""}function Oc(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Uc(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const h_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Oo(r){return r.replace(h_,u_)}const d_=new Map;function u_(r,e){let t=qe[e];if(t===void 0){const n=d_.get(e);if(n!==void 0)t=qe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Oo(t)}const f_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fc(r){return r.replace(f_,p_)}function p_(r,e,t,n){let i="";for(let s=parseInt(e);s<parseInt(t);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function Bc(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function m_(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===sh?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===ud?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===Pn&&(e="SHADOWMAP_TYPE_VSM"),e}function g_(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case Gi:case Wi:e="ENVMAP_TYPE_CUBE";break;case zr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function __(r){let e="ENVMAP_MODE_REFLECTION";return r.envMap&&r.envMapMode===Wi&&(e="ENVMAP_MODE_REFRACTION"),e}function v_(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case rh:e="ENVMAP_BLENDING_MULTIPLY";break;case Ld:e="ENVMAP_BLENDING_MIX";break;case Id:e="ENVMAP_BLENDING_ADD";break}return e}function x_(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function S_(r,e,t,n){const i=r.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=m_(t),c=g_(t),h=__(t),d=v_(t),f=x_(t),u=o_(t),g=l_(s),_=i.createProgram();let p,m,w=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ss).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ss).join(`
`),m.length>0&&(m+=`
`)):(p=[Bc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ss).join(`
`),m=[Bc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==$n?"#define TONE_MAPPING":"",t.toneMapping!==$n?qe.tonemapping_pars_fragment:"",t.toneMapping!==$n?r_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,s_("linearToOutputTexel",t.outputColorSpace),a_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ss).join(`
`)),a=Oo(a),a=Oc(a,t),a=Uc(a,t),o=Oo(o),o=Oc(o,t),o=Uc(o,t),a=Fc(a),o=Fc(o),t.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,p=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===wl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===wl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const S=w+p+a,v=w+m+o,A=Ic(i,i.VERTEX_SHADER,S),R=Ic(i,i.FRAGMENT_SHADER,v);i.attachShader(_,A),i.attachShader(_,R),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function P(L){if(r.debug.checkShaderErrors){const U=i.getProgramInfoLog(_)||"",B=i.getShaderInfoLog(A)||"",W=i.getShaderInfoLog(R)||"",z=U.trim(),X=B.trim(),Z=W.trim();let V=!0,ne=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(V=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,A,R);else{const pe=Nc(i,A,"vertex"),xe=Nc(i,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+z+`
`+pe+`
`+xe)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(X===""||Z==="")&&(ne=!1);ne&&(L.diagnostics={runnable:V,programLog:z,vertexShader:{log:X,prefix:p},fragmentShader:{log:Z,prefix:m}})}i.deleteShader(A),i.deleteShader(R),C=new Ir(i,_),M=c_(i,_)}let C;this.getUniforms=function(){return C===void 0&&P(this),C};let M;this.getAttributes=function(){return M===void 0&&P(this),M};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=i.getProgramParameter(_,e_)),y},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=t_++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=R,this}let y_=0;class M_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new E_(e),t.set(e,n)),n}}class E_{constructor(e){this.id=y_++,this.code=e,this.usedTimes=0}}function T_(r,e,t,n,i,s,a){const o=new Zo,l=new M_,c=new Set,h=[],d=i.logarithmicDepthBuffer,f=i.vertexTextures;let u=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return c.add(M),M===0?"uv":`uv${M}`}function p(M,y,L,U,B){const W=U.fog,z=B.geometry,X=M.isMeshStandardMaterial?U.environment:null,Z=(M.isMeshStandardMaterial?t:e).get(M.envMap||X),V=Z&&Z.mapping===zr?Z.image.height:null,ne=g[M.type];M.precision!==null&&(u=i.getMaxPrecision(M.precision),u!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",u,"instead."));const pe=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,xe=pe!==void 0?pe.length:0;let ze=0;z.morphAttributes.position!==void 0&&(ze=1),z.morphAttributes.normal!==void 0&&(ze=2),z.morphAttributes.color!==void 0&&(ze=3);let Ze,nt,Qe,Y;if(ne){const st=mn[ne];Ze=st.vertexShader,nt=st.fragmentShader}else Ze=M.vertexShader,nt=M.fragmentShader,l.update(M),Qe=l.getVertexShaderID(M),Y=l.getFragmentShaderID(M);const te=r.getRenderTarget(),Me=r.state.buffers.depth.getReversed(),Le=B.isInstancedMesh===!0,we=B.isBatchedMesh===!0,$e=!!M.map,ft=!!M.matcap,I=!!Z,ee=!!M.aoMap,J=!!M.lightMap,$=!!M.bumpMap,K=!!M.normalMap,he=!!M.displacementMap,ie=!!M.emissiveMap,de=!!M.metalnessMap,Ve=!!M.roughnessMap,ke=M.anisotropy>0,b=M.clearcoat>0,x=M.dispersion>0,F=M.iridescence>0,G=M.sheen>0,Q=M.transmission>0,q=ke&&!!M.anisotropyMap,Ce=b&&!!M.clearcoatMap,ce=b&&!!M.clearcoatNormalMap,be=b&&!!M.clearcoatRoughnessMap,Ae=F&&!!M.iridescenceMap,se=F&&!!M.iridescenceThicknessMap,_e=G&&!!M.sheenColorMap,Oe=G&&!!M.sheenRoughnessMap,Pe=!!M.specularMap,me=!!M.specularColorMap,We=!!M.specularIntensityMap,D=Q&&!!M.transmissionMap,oe=Q&&!!M.thicknessMap,ue=!!M.gradientMap,Ee=!!M.alphaMap,re=M.alphaTest>0,j=!!M.alphaHash,Re=!!M.extensions;let Ge=$n;M.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Ge=r.toneMapping);const pt={shaderID:ne,shaderType:M.type,shaderName:M.name,vertexShader:Ze,fragmentShader:nt,defines:M.defines,customVertexShaderID:Qe,customFragmentShaderID:Y,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:u,batching:we,batchingColor:we&&B._colorsTexture!==null,instancing:Le,instancingColor:Le&&B.instanceColor!==null,instancingMorph:Le&&B.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:te===null?r.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Ht,alphaToCoverage:!!M.alphaToCoverage,map:$e,matcap:ft,envMap:I,envMapMode:I&&Z.mapping,envMapCubeUVHeight:V,aoMap:ee,lightMap:J,bumpMap:$,normalMap:K,displacementMap:f&&he,emissiveMap:ie,normalMapObjectSpace:K&&M.normalMapType===Xd,normalMapTangentSpace:K&&M.normalMapType===gh,metalnessMap:de,roughnessMap:Ve,anisotropy:ke,anisotropyMap:q,clearcoat:b,clearcoatMap:Ce,clearcoatNormalMap:ce,clearcoatRoughnessMap:be,dispersion:x,iridescence:F,iridescenceMap:Ae,iridescenceThicknessMap:se,sheen:G,sheenColorMap:_e,sheenRoughnessMap:Oe,specularMap:Pe,specularColorMap:me,specularIntensityMap:We,transmission:Q,transmissionMap:D,thicknessMap:oe,gradientMap:ue,opaque:M.transparent===!1&&M.blending===ki&&M.alphaToCoverage===!1,alphaMap:Ee,alphaTest:re,alphaHash:j,combine:M.combine,mapUv:$e&&_(M.map.channel),aoMapUv:ee&&_(M.aoMap.channel),lightMapUv:J&&_(M.lightMap.channel),bumpMapUv:$&&_(M.bumpMap.channel),normalMapUv:K&&_(M.normalMap.channel),displacementMapUv:he&&_(M.displacementMap.channel),emissiveMapUv:ie&&_(M.emissiveMap.channel),metalnessMapUv:de&&_(M.metalnessMap.channel),roughnessMapUv:Ve&&_(M.roughnessMap.channel),anisotropyMapUv:q&&_(M.anisotropyMap.channel),clearcoatMapUv:Ce&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:ce&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:be&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Ae&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:se&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:_e&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:Oe&&_(M.sheenRoughnessMap.channel),specularMapUv:Pe&&_(M.specularMap.channel),specularColorMapUv:me&&_(M.specularColorMap.channel),specularIntensityMapUv:We&&_(M.specularIntensityMap.channel),transmissionMapUv:D&&_(M.transmissionMap.channel),thicknessMapUv:oe&&_(M.thicknessMap.channel),alphaMapUv:Ee&&_(M.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(K||ke),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!z.attributes.uv&&($e||Ee),fog:!!W,useFog:M.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Me,skinning:B.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:ze,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:r.shadowMap.enabled&&L.length>0,shadowMapType:r.shadowMap.type,toneMapping:Ge,decodeVideoTexture:$e&&M.map.isVideoTexture===!0&&je.getTransfer(M.map.colorSpace)===ht,decodeVideoTextureEmissive:ie&&M.emissiveMap.isVideoTexture===!0&&je.getTransfer(M.emissiveMap.colorSpace)===ht,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Et,flipSided:M.side===Gt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Re&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Re&&M.extensions.multiDraw===!0||we)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return pt.vertexUv1s=c.has(1),pt.vertexUv2s=c.has(2),pt.vertexUv3s=c.has(3),c.clear(),pt}function m(M){const y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(const L in M.defines)y.push(L),y.push(M.defines[L]);return M.isRawShaderMaterial===!1&&(w(y,M),S(y,M),y.push(r.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function w(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function S(M,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),y.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reversedDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),M.push(o.mask)}function v(M){const y=g[M.type];let L;if(y){const U=mn[y];L=Ou.clone(U.uniforms)}else L=M.uniforms;return L}function A(M,y){let L;for(let U=0,B=h.length;U<B;U++){const W=h[U];if(W.cacheKey===y){L=W,++L.usedTimes;break}}return L===void 0&&(L=new S_(r,y,M,s),h.push(L)),L}function R(M){if(--M.usedTimes===0){const y=h.indexOf(M);h[y]=h[h.length-1],h.pop(),M.destroy()}}function P(M){l.remove(M)}function C(){l.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:v,acquireProgram:A,releaseProgram:R,releaseShaderCache:P,programs:h,dispose:C}}function w_(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function n(a){r.delete(a)}function i(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:s}}function b_(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function kc(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function Hc(){const r=[];let e=0;const t=[],n=[],i=[];function s(){e=0,t.length=0,n.length=0,i.length=0}function a(d,f,u,g,_,p){let m=r[e];return m===void 0?(m={id:d.id,object:d,geometry:f,material:u,groupOrder:g,renderOrder:d.renderOrder,z:_,group:p},r[e]=m):(m.id=d.id,m.object=d,m.geometry=f,m.material=u,m.groupOrder=g,m.renderOrder=d.renderOrder,m.z=_,m.group=p),e++,m}function o(d,f,u,g,_,p){const m=a(d,f,u,g,_,p);u.transmission>0?n.push(m):u.transparent===!0?i.push(m):t.push(m)}function l(d,f,u,g,_,p){const m=a(d,f,u,g,_,p);u.transmission>0?n.unshift(m):u.transparent===!0?i.unshift(m):t.unshift(m)}function c(d,f){t.length>1&&t.sort(d||b_),n.length>1&&n.sort(f||kc),i.length>1&&i.sort(f||kc)}function h(){for(let d=e,f=r.length;d<f;d++){const u=r[d];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:t,transmissive:n,transparent:i,init:s,push:o,unshift:l,finish:h,sort:c}}function A_(){let r=new WeakMap;function e(n,i){const s=r.get(n);let a;return s===void 0?(a=new Hc,r.set(n,[a])):i>=s.length?(a=new Hc,s.push(a)):a=s[i],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function R_(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new E,color:new Fe};break;case"SpotLight":t={position:new E,direction:new E,color:new Fe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new E,color:new Fe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new E,skyColor:new Fe,groundColor:new Fe};break;case"RectAreaLight":t={color:new Fe,position:new E,halfWidth:new E,halfHeight:new E};break}return r[e.id]=t,t}}}function C_(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new le,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let P_=0;function L_(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function I_(r){const e=new R_,t=C_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new E);const i=new E,s=new He,a=new He;function o(c){let h=0,d=0,f=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let u=0,g=0,_=0,p=0,m=0,w=0,S=0,v=0,A=0,R=0,P=0;c.sort(L_);for(let M=0,y=c.length;M<y;M++){const L=c[M],U=L.color,B=L.intensity,W=L.distance,z=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=U.r*B,d+=U.g*B,f+=U.b*B;else if(L.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(L.sh.coefficients[X],B);P++}else if(L.isDirectionalLight){const X=e.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const Z=L.shadow,V=t.get(L);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.directionalShadow[u]=V,n.directionalShadowMap[u]=z,n.directionalShadowMatrix[u]=L.shadow.matrix,w++}n.directional[u]=X,u++}else if(L.isSpotLight){const X=e.get(L);X.position.setFromMatrixPosition(L.matrixWorld),X.color.copy(U).multiplyScalar(B),X.distance=W,X.coneCos=Math.cos(L.angle),X.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),X.decay=L.decay,n.spot[_]=X;const Z=L.shadow;if(L.map&&(n.spotLightMap[A]=L.map,A++,Z.updateMatrices(L),L.castShadow&&R++),n.spotLightMatrix[_]=Z.matrix,L.castShadow){const V=t.get(L);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,n.spotShadow[_]=V,n.spotShadowMap[_]=z,v++}_++}else if(L.isRectAreaLight){const X=e.get(L);X.color.copy(U).multiplyScalar(B),X.halfWidth.set(L.width*.5,0,0),X.halfHeight.set(0,L.height*.5,0),n.rectArea[p]=X,p++}else if(L.isPointLight){const X=e.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),X.distance=L.distance,X.decay=L.decay,L.castShadow){const Z=L.shadow,V=t.get(L);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,V.shadowCameraNear=Z.camera.near,V.shadowCameraFar=Z.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=z,n.pointShadowMatrix[g]=L.shadow.matrix,S++}n.point[g]=X,g++}else if(L.isHemisphereLight){const X=e.get(L);X.skyColor.copy(L.color).multiplyScalar(B),X.groundColor.copy(L.groundColor).multiplyScalar(B),n.hemi[m]=X,m++}}p>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=fe.LTC_FLOAT_1,n.rectAreaLTC2=fe.LTC_FLOAT_2):(n.rectAreaLTC1=fe.LTC_HALF_1,n.rectAreaLTC2=fe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=f;const C=n.hash;(C.directionalLength!==u||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==p||C.hemiLength!==m||C.numDirectionalShadows!==w||C.numPointShadows!==S||C.numSpotShadows!==v||C.numSpotMaps!==A||C.numLightProbes!==P)&&(n.directional.length=u,n.spot.length=_,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=w,n.directionalShadowMap.length=w,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=w,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=v+A-R,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=P,C.directionalLength=u,C.pointLength=g,C.spotLength=_,C.rectAreaLength=p,C.hemiLength=m,C.numDirectionalShadows=w,C.numPointShadows=S,C.numSpotShadows=v,C.numSpotMaps=A,C.numLightProbes=P,n.version=P_++)}function l(c,h){let d=0,f=0,u=0,g=0,_=0;const p=h.matrixWorldInverse;for(let m=0,w=c.length;m<w;m++){const S=c[m];if(S.isDirectionalLight){const v=n.directional[d];v.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(p),d++}else if(S.isSpotLight){const v=n.spot[u];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(p),v.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(p),u++}else if(S.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(p),a.identity(),s.copy(S.matrixWorld),s.premultiply(p),a.extractRotation(s),v.halfWidth.set(S.width*.5,0,0),v.halfHeight.set(0,S.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(S.isPointLight){const v=n.point[f];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(p),f++}else if(S.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(S.matrixWorld),v.direction.transformDirection(p),_++}}}return{setup:o,setupView:l,state:n}}function zc(r){const e=new I_(r),t=[],n=[];function i(h){c.camera=h,t.length=0,n.length=0}function s(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function D_(r){let e=new WeakMap;function t(i,s=0){const a=e.get(i);let o;return a===void 0?(o=new zc(r),e.set(i,[o])):s>=a.length?(o=new zc(r),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const N_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,O_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function U_(r,e,t){let n=new jo;const i=new le,s=new le,a=new it,o=new If({depthPacking:Wd}),l=new Df,c={},h=t.maxTextureSize,d={[Fn]:Gt,[Gt]:Fn,[Et]:Et},f=new jn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new le},radius:{value:4}},vertexShader:N_,fragmentShader:O_}),u=f.clone();u.defines.HORIZONTAL_PASS=1;const g=new Tt;g.setAttribute("position",new kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Se(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=sh;let m=this.type;this.render=function(R,P,C){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||R.length===0)return;const M=r.getRenderTarget(),y=r.getActiveCubeFace(),L=r.getActiveMipmapLevel(),U=r.state;U.setBlending(Zn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const B=m!==Pn&&this.type===Pn,W=m===Pn&&this.type!==Pn;for(let z=0,X=R.length;z<X;z++){const Z=R[z],V=Z.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;i.copy(V.mapSize);const ne=V.getFrameExtents();if(i.multiply(ne),s.copy(V.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/ne.x),i.x=s.x*ne.x,V.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/ne.y),i.y=s.y*ne.y,V.mapSize.y=s.y)),V.map===null||B===!0||W===!0){const xe=this.type!==Pn?{minFilter:Bt,magFilter:Bt}:{};V.map!==null&&V.map.dispose(),V.map=new Jn(i.x,i.y,xe),V.map.texture.name=Z.name+".shadowMap",V.camera.updateProjectionMatrix()}r.setRenderTarget(V.map),r.clear();const pe=V.getViewportCount();for(let xe=0;xe<pe;xe++){const ze=V.getViewport(xe);a.set(s.x*ze.x,s.y*ze.y,s.x*ze.z,s.y*ze.w),U.viewport(a),V.updateMatrices(Z,xe),n=V.getFrustum(),v(P,C,V.camera,Z,this.type)}V.isPointLightShadow!==!0&&this.type===Pn&&w(V,C),V.needsUpdate=!1}m=this.type,p.needsUpdate=!1,r.setRenderTarget(M,y,L)};function w(R,P){const C=e.update(_);f.defines.VSM_SAMPLES!==R.blurSamples&&(f.defines.VSM_SAMPLES=R.blurSamples,u.defines.VSM_SAMPLES=R.blurSamples,f.needsUpdate=!0,u.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new Jn(i.x,i.y)),f.uniforms.shadow_pass.value=R.map.texture,f.uniforms.resolution.value=R.mapSize,f.uniforms.radius.value=R.radius,r.setRenderTarget(R.mapPass),r.clear(),r.renderBufferDirect(P,null,C,f,_,null),u.uniforms.shadow_pass.value=R.mapPass.texture,u.uniforms.resolution.value=R.mapSize,u.uniforms.radius.value=R.radius,r.setRenderTarget(R.map),r.clear(),r.renderBufferDirect(P,null,C,u,_,null)}function S(R,P,C,M){let y=null;const L=C.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(L!==void 0)y=L;else if(y=C.isPointLight===!0?l:o,r.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const U=y.uuid,B=P.uuid;let W=c[U];W===void 0&&(W={},c[U]=W);let z=W[B];z===void 0&&(z=y.clone(),W[B]=z,P.addEventListener("dispose",A)),y=z}if(y.visible=P.visible,y.wireframe=P.wireframe,M===Pn?y.side=P.shadowSide!==null?P.shadowSide:P.side:y.side=P.shadowSide!==null?P.shadowSide:d[P.side],y.alphaMap=P.alphaMap,y.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,y.map=P.map,y.clipShadows=P.clipShadows,y.clippingPlanes=P.clippingPlanes,y.clipIntersection=P.clipIntersection,y.displacementMap=P.displacementMap,y.displacementScale=P.displacementScale,y.displacementBias=P.displacementBias,y.wireframeLinewidth=P.wireframeLinewidth,y.linewidth=P.linewidth,C.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const U=r.properties.get(y);U.light=C}return y}function v(R,P,C,M,y){if(R.visible===!1)return;if(R.layers.test(P.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&y===Pn)&&(!R.frustumCulled||n.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,R.matrixWorld);const B=e.update(R),W=R.material;if(Array.isArray(W)){const z=B.groups;for(let X=0,Z=z.length;X<Z;X++){const V=z[X],ne=W[V.materialIndex];if(ne&&ne.visible){const pe=S(R,ne,M,y);R.onBeforeShadow(r,R,P,C,B,pe,V),r.renderBufferDirect(C,null,B,pe,R,V),R.onAfterShadow(r,R,P,C,B,pe,V)}}}else if(W.visible){const z=S(R,W,M,y);R.onBeforeShadow(r,R,P,C,B,z,null),r.renderBufferDirect(C,null,B,z,R,null),R.onAfterShadow(r,R,P,C,B,z,null)}}const U=R.children;for(let B=0,W=U.length;B<W;B++)v(U[B],P,C,M,y)}function A(R){R.target.removeEventListener("dispose",A);for(const C in c){const M=c[C],y=R.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}const F_={[Va]:Ga,[Wa]:Ya,[Xa]:Ka,[Vi]:qa,[Ga]:Va,[Ya]:Wa,[Ka]:Xa,[qa]:Vi};function B_(r,e){function t(){let D=!1;const oe=new it;let ue=null;const Ee=new it(0,0,0,0);return{setMask:function(re){ue!==re&&!D&&(r.colorMask(re,re,re,re),ue=re)},setLocked:function(re){D=re},setClear:function(re,j,Re,Ge,pt){pt===!0&&(re*=Ge,j*=Ge,Re*=Ge),oe.set(re,j,Re,Ge),Ee.equals(oe)===!1&&(r.clearColor(re,j,Re,Ge),Ee.copy(oe))},reset:function(){D=!1,ue=null,Ee.set(-1,0,0,0)}}}function n(){let D=!1,oe=!1,ue=null,Ee=null,re=null;return{setReversed:function(j){if(oe!==j){const Re=e.get("EXT_clip_control");j?Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.ZERO_TO_ONE_EXT):Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.NEGATIVE_ONE_TO_ONE_EXT),oe=j;const Ge=re;re=null,this.setClear(Ge)}},getReversed:function(){return oe},setTest:function(j){j?te(r.DEPTH_TEST):Me(r.DEPTH_TEST)},setMask:function(j){ue!==j&&!D&&(r.depthMask(j),ue=j)},setFunc:function(j){if(oe&&(j=F_[j]),Ee!==j){switch(j){case Va:r.depthFunc(r.NEVER);break;case Ga:r.depthFunc(r.ALWAYS);break;case Wa:r.depthFunc(r.LESS);break;case Vi:r.depthFunc(r.LEQUAL);break;case Xa:r.depthFunc(r.EQUAL);break;case qa:r.depthFunc(r.GEQUAL);break;case Ya:r.depthFunc(r.GREATER);break;case Ka:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}Ee=j}},setLocked:function(j){D=j},setClear:function(j){re!==j&&(oe&&(j=1-j),r.clearDepth(j),re=j)},reset:function(){D=!1,ue=null,Ee=null,re=null,oe=!1}}}function i(){let D=!1,oe=null,ue=null,Ee=null,re=null,j=null,Re=null,Ge=null,pt=null;return{setTest:function(st){D||(st?te(r.STENCIL_TEST):Me(r.STENCIL_TEST))},setMask:function(st){oe!==st&&!D&&(r.stencilMask(st),oe=st)},setFunc:function(st,En,fn){(ue!==st||Ee!==En||re!==fn)&&(r.stencilFunc(st,En,fn),ue=st,Ee=En,re=fn)},setOp:function(st,En,fn){(j!==st||Re!==En||Ge!==fn)&&(r.stencilOp(st,En,fn),j=st,Re=En,Ge=fn)},setLocked:function(st){D=st},setClear:function(st){pt!==st&&(r.clearStencil(st),pt=st)},reset:function(){D=!1,oe=null,ue=null,Ee=null,re=null,j=null,Re=null,Ge=null,pt=null}}}const s=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},d={},f=new WeakMap,u=[],g=null,_=!1,p=null,m=null,w=null,S=null,v=null,A=null,R=null,P=new Fe(0,0,0),C=0,M=!1,y=null,L=null,U=null,B=null,W=null;const z=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,Z=0;const V=r.getParameter(r.VERSION);V.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(V)[1]),X=Z>=1):V.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),X=Z>=2);let ne=null,pe={};const xe=r.getParameter(r.SCISSOR_BOX),ze=r.getParameter(r.VIEWPORT),Ze=new it().fromArray(xe),nt=new it().fromArray(ze);function Qe(D,oe,ue,Ee){const re=new Uint8Array(4),j=r.createTexture();r.bindTexture(D,j),r.texParameteri(D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(D,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Re=0;Re<ue;Re++)D===r.TEXTURE_3D||D===r.TEXTURE_2D_ARRAY?r.texImage3D(oe,0,r.RGBA,1,1,Ee,0,r.RGBA,r.UNSIGNED_BYTE,re):r.texImage2D(oe+Re,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,re);return j}const Y={};Y[r.TEXTURE_2D]=Qe(r.TEXTURE_2D,r.TEXTURE_2D,1),Y[r.TEXTURE_CUBE_MAP]=Qe(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[r.TEXTURE_2D_ARRAY]=Qe(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),Y[r.TEXTURE_3D]=Qe(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),te(r.DEPTH_TEST),a.setFunc(Vi),$(!1),K(gl),te(r.CULL_FACE),ee(Zn);function te(D){h[D]!==!0&&(r.enable(D),h[D]=!0)}function Me(D){h[D]!==!1&&(r.disable(D),h[D]=!1)}function Le(D,oe){return d[D]!==oe?(r.bindFramebuffer(D,oe),d[D]=oe,D===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=oe),D===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=oe),!0):!1}function we(D,oe){let ue=u,Ee=!1;if(D){ue=f.get(oe),ue===void 0&&(ue=[],f.set(oe,ue));const re=D.textures;if(ue.length!==re.length||ue[0]!==r.COLOR_ATTACHMENT0){for(let j=0,Re=re.length;j<Re;j++)ue[j]=r.COLOR_ATTACHMENT0+j;ue.length=re.length,Ee=!0}}else ue[0]!==r.BACK&&(ue[0]=r.BACK,Ee=!0);Ee&&r.drawBuffers(ue)}function $e(D){return g!==D?(r.useProgram(D),g=D,!0):!1}const ft={[hi]:r.FUNC_ADD,[pd]:r.FUNC_SUBTRACT,[md]:r.FUNC_REVERSE_SUBTRACT};ft[gd]=r.MIN,ft[_d]=r.MAX;const I={[vd]:r.ZERO,[xd]:r.ONE,[Sd]:r.SRC_COLOR,[Ha]:r.SRC_ALPHA,[bd]:r.SRC_ALPHA_SATURATE,[Td]:r.DST_COLOR,[Md]:r.DST_ALPHA,[yd]:r.ONE_MINUS_SRC_COLOR,[za]:r.ONE_MINUS_SRC_ALPHA,[wd]:r.ONE_MINUS_DST_COLOR,[Ed]:r.ONE_MINUS_DST_ALPHA,[Ad]:r.CONSTANT_COLOR,[Rd]:r.ONE_MINUS_CONSTANT_COLOR,[Cd]:r.CONSTANT_ALPHA,[Pd]:r.ONE_MINUS_CONSTANT_ALPHA};function ee(D,oe,ue,Ee,re,j,Re,Ge,pt,st){if(D===Zn){_===!0&&(Me(r.BLEND),_=!1);return}if(_===!1&&(te(r.BLEND),_=!0),D!==fd){if(D!==p||st!==M){if((m!==hi||v!==hi)&&(r.blendEquation(r.FUNC_ADD),m=hi,v=hi),st)switch(D){case ki:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case _l:r.blendFunc(r.ONE,r.ONE);break;case vl:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case xl:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case ki:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case _l:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case vl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case xl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}w=null,S=null,A=null,R=null,P.set(0,0,0),C=0,p=D,M=st}return}re=re||oe,j=j||ue,Re=Re||Ee,(oe!==m||re!==v)&&(r.blendEquationSeparate(ft[oe],ft[re]),m=oe,v=re),(ue!==w||Ee!==S||j!==A||Re!==R)&&(r.blendFuncSeparate(I[ue],I[Ee],I[j],I[Re]),w=ue,S=Ee,A=j,R=Re),(Ge.equals(P)===!1||pt!==C)&&(r.blendColor(Ge.r,Ge.g,Ge.b,pt),P.copy(Ge),C=pt),p=D,M=!1}function J(D,oe){D.side===Et?Me(r.CULL_FACE):te(r.CULL_FACE);let ue=D.side===Gt;oe&&(ue=!ue),$(ue),D.blending===ki&&D.transparent===!1?ee(Zn):ee(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),s.setMask(D.colorWrite);const Ee=D.stencilWrite;o.setTest(Ee),Ee&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),ie(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?te(r.SAMPLE_ALPHA_TO_COVERAGE):Me(r.SAMPLE_ALPHA_TO_COVERAGE)}function $(D){y!==D&&(D?r.frontFace(r.CW):r.frontFace(r.CCW),y=D)}function K(D){D!==hd?(te(r.CULL_FACE),D!==L&&(D===gl?r.cullFace(r.BACK):D===dd?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Me(r.CULL_FACE),L=D}function he(D){D!==U&&(X&&r.lineWidth(D),U=D)}function ie(D,oe,ue){D?(te(r.POLYGON_OFFSET_FILL),(B!==oe||W!==ue)&&(r.polygonOffset(oe,ue),B=oe,W=ue)):Me(r.POLYGON_OFFSET_FILL)}function de(D){D?te(r.SCISSOR_TEST):Me(r.SCISSOR_TEST)}function Ve(D){D===void 0&&(D=r.TEXTURE0+z-1),ne!==D&&(r.activeTexture(D),ne=D)}function ke(D,oe,ue){ue===void 0&&(ne===null?ue=r.TEXTURE0+z-1:ue=ne);let Ee=pe[ue];Ee===void 0&&(Ee={type:void 0,texture:void 0},pe[ue]=Ee),(Ee.type!==D||Ee.texture!==oe)&&(ne!==ue&&(r.activeTexture(ue),ne=ue),r.bindTexture(D,oe||Y[D]),Ee.type=D,Ee.texture=oe)}function b(){const D=pe[ne];D!==void 0&&D.type!==void 0&&(r.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function x(){try{r.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function F(){try{r.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function G(){try{r.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Q(){try{r.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function q(){try{r.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ce(){try{r.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ce(){try{r.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function be(){try{r.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ae(){try{r.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function se(){try{r.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function _e(D){Ze.equals(D)===!1&&(r.scissor(D.x,D.y,D.z,D.w),Ze.copy(D))}function Oe(D){nt.equals(D)===!1&&(r.viewport(D.x,D.y,D.z,D.w),nt.copy(D))}function Pe(D,oe){let ue=c.get(oe);ue===void 0&&(ue=new WeakMap,c.set(oe,ue));let Ee=ue.get(D);Ee===void 0&&(Ee=r.getUniformBlockIndex(oe,D.name),ue.set(D,Ee))}function me(D,oe){const Ee=c.get(oe).get(D);l.get(oe)!==Ee&&(r.uniformBlockBinding(oe,Ee,D.__bindingPointIndex),l.set(oe,Ee))}function We(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},ne=null,pe={},d={},f=new WeakMap,u=[],g=null,_=!1,p=null,m=null,w=null,S=null,v=null,A=null,R=null,P=new Fe(0,0,0),C=0,M=!1,y=null,L=null,U=null,B=null,W=null,Ze.set(0,0,r.canvas.width,r.canvas.height),nt.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:te,disable:Me,bindFramebuffer:Le,drawBuffers:we,useProgram:$e,setBlending:ee,setMaterial:J,setFlipSided:$,setCullFace:K,setLineWidth:he,setPolygonOffset:ie,setScissorTest:de,activeTexture:Ve,bindTexture:ke,unbindTexture:b,compressedTexImage2D:x,compressedTexImage3D:F,texImage2D:Ae,texImage3D:se,updateUBOMapping:Pe,uniformBlockBinding:me,texStorage2D:ce,texStorage3D:be,texSubImage2D:G,texSubImage3D:Q,compressedTexSubImage2D:q,compressedTexSubImage3D:Ce,scissor:_e,viewport:Oe,reset:We}}function k_(r,e,t,n,i,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new le,h=new WeakMap;let d;const f=new WeakMap;let u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(b,x){return u?new OffscreenCanvas(b,x):Is("canvas")}function _(b,x,F){let G=1;const Q=ke(b);if((Q.width>F||Q.height>F)&&(G=F/Math.max(Q.width,Q.height)),G<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const q=Math.floor(G*Q.width),Ce=Math.floor(G*Q.height);d===void 0&&(d=g(q,Ce));const ce=x?g(q,Ce):d;return ce.width=q,ce.height=Ce,ce.getContext("2d").drawImage(b,0,0,q,Ce),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+q+"x"+Ce+")."),ce}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),b;return b}function p(b){return b.generateMipmaps}function m(b){r.generateMipmap(b)}function w(b){return b.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:b.isWebGL3DRenderTarget?r.TEXTURE_3D:b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function S(b,x,F,G,Q=!1){if(b!==null){if(r[b]!==void 0)return r[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let q=x;if(x===r.RED&&(F===r.FLOAT&&(q=r.R32F),F===r.HALF_FLOAT&&(q=r.R16F),F===r.UNSIGNED_BYTE&&(q=r.R8)),x===r.RED_INTEGER&&(F===r.UNSIGNED_BYTE&&(q=r.R8UI),F===r.UNSIGNED_SHORT&&(q=r.R16UI),F===r.UNSIGNED_INT&&(q=r.R32UI),F===r.BYTE&&(q=r.R8I),F===r.SHORT&&(q=r.R16I),F===r.INT&&(q=r.R32I)),x===r.RG&&(F===r.FLOAT&&(q=r.RG32F),F===r.HALF_FLOAT&&(q=r.RG16F),F===r.UNSIGNED_BYTE&&(q=r.RG8)),x===r.RG_INTEGER&&(F===r.UNSIGNED_BYTE&&(q=r.RG8UI),F===r.UNSIGNED_SHORT&&(q=r.RG16UI),F===r.UNSIGNED_INT&&(q=r.RG32UI),F===r.BYTE&&(q=r.RG8I),F===r.SHORT&&(q=r.RG16I),F===r.INT&&(q=r.RG32I)),x===r.RGB_INTEGER&&(F===r.UNSIGNED_BYTE&&(q=r.RGB8UI),F===r.UNSIGNED_SHORT&&(q=r.RGB16UI),F===r.UNSIGNED_INT&&(q=r.RGB32UI),F===r.BYTE&&(q=r.RGB8I),F===r.SHORT&&(q=r.RGB16I),F===r.INT&&(q=r.RGB32I)),x===r.RGBA_INTEGER&&(F===r.UNSIGNED_BYTE&&(q=r.RGBA8UI),F===r.UNSIGNED_SHORT&&(q=r.RGBA16UI),F===r.UNSIGNED_INT&&(q=r.RGBA32UI),F===r.BYTE&&(q=r.RGBA8I),F===r.SHORT&&(q=r.RGBA16I),F===r.INT&&(q=r.RGBA32I)),x===r.RGB&&(F===r.UNSIGNED_INT_5_9_9_9_REV&&(q=r.RGB9_E5),F===r.UNSIGNED_INT_10F_11F_11F_REV&&(q=r.R11F_G11F_B10F)),x===r.RGBA){const Ce=Q?Or:je.getTransfer(G);F===r.FLOAT&&(q=r.RGBA32F),F===r.HALF_FLOAT&&(q=r.RGBA16F),F===r.UNSIGNED_BYTE&&(q=Ce===ht?r.SRGB8_ALPHA8:r.RGBA8),F===r.UNSIGNED_SHORT_4_4_4_4&&(q=r.RGBA4),F===r.UNSIGNED_SHORT_5_5_5_1&&(q=r.RGB5_A1)}return(q===r.R16F||q===r.R32F||q===r.RG16F||q===r.RG32F||q===r.RGBA16F||q===r.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function v(b,x){let F;return b?x===null||x===ui||x===As?F=r.DEPTH24_STENCIL8:x===cn?F=r.DEPTH32F_STENCIL8:x===bs&&(F=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===ui||x===As?F=r.DEPTH_COMPONENT24:x===cn?F=r.DEPTH_COMPONENT32F:x===bs&&(F=r.DEPTH_COMPONENT16),F}function A(b,x){return p(b)===!0||b.isFramebufferTexture&&b.minFilter!==Bt&&b.minFilter!==Zt?Math.log2(Math.max(x.width,x.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?x.mipmaps.length:1}function R(b){const x=b.target;x.removeEventListener("dispose",R),C(x),x.isVideoTexture&&h.delete(x)}function P(b){const x=b.target;x.removeEventListener("dispose",P),y(x)}function C(b){const x=n.get(b);if(x.__webglInit===void 0)return;const F=b.source,G=f.get(F);if(G){const Q=G[x.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&M(b),Object.keys(G).length===0&&f.delete(F)}n.remove(b)}function M(b){const x=n.get(b);r.deleteTexture(x.__webglTexture);const F=b.source,G=f.get(F);delete G[x.__cacheKey],a.memory.textures--}function y(b){const x=n.get(b);if(b.depthTexture&&(b.depthTexture.dispose(),n.remove(b.depthTexture)),b.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(x.__webglFramebuffer[G]))for(let Q=0;Q<x.__webglFramebuffer[G].length;Q++)r.deleteFramebuffer(x.__webglFramebuffer[G][Q]);else r.deleteFramebuffer(x.__webglFramebuffer[G]);x.__webglDepthbuffer&&r.deleteRenderbuffer(x.__webglDepthbuffer[G])}else{if(Array.isArray(x.__webglFramebuffer))for(let G=0;G<x.__webglFramebuffer.length;G++)r.deleteFramebuffer(x.__webglFramebuffer[G]);else r.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&r.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&r.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let G=0;G<x.__webglColorRenderbuffer.length;G++)x.__webglColorRenderbuffer[G]&&r.deleteRenderbuffer(x.__webglColorRenderbuffer[G]);x.__webglDepthRenderbuffer&&r.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const F=b.textures;for(let G=0,Q=F.length;G<Q;G++){const q=n.get(F[G]);q.__webglTexture&&(r.deleteTexture(q.__webglTexture),a.memory.textures--),n.remove(F[G])}n.remove(b)}let L=0;function U(){L=0}function B(){const b=L;return b>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+i.maxTextures),L+=1,b}function W(b){const x=[];return x.push(b.wrapS),x.push(b.wrapT),x.push(b.wrapR||0),x.push(b.magFilter),x.push(b.minFilter),x.push(b.anisotropy),x.push(b.internalFormat),x.push(b.format),x.push(b.type),x.push(b.generateMipmaps),x.push(b.premultiplyAlpha),x.push(b.flipY),x.push(b.unpackAlignment),x.push(b.colorSpace),x.join()}function z(b,x){const F=n.get(b);if(b.isVideoTexture&&de(b),b.isRenderTargetTexture===!1&&b.isExternalTexture!==!0&&b.version>0&&F.__version!==b.version){const G=b.image;if(G===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(F,b,x);return}}else b.isExternalTexture&&(F.__webglTexture=b.sourceTexture?b.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,F.__webglTexture,r.TEXTURE0+x)}function X(b,x){const F=n.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&F.__version!==b.version){Y(F,b,x);return}t.bindTexture(r.TEXTURE_2D_ARRAY,F.__webglTexture,r.TEXTURE0+x)}function Z(b,x){const F=n.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&F.__version!==b.version){Y(F,b,x);return}t.bindTexture(r.TEXTURE_3D,F.__webglTexture,r.TEXTURE0+x)}function V(b,x){const F=n.get(b);if(b.version>0&&F.__version!==b.version){te(F,b,x);return}t.bindTexture(r.TEXTURE_CUBE_MAP,F.__webglTexture,r.TEXTURE0+x)}const ne={[Xi]:r.REPEAT,[Kn]:r.CLAMP_TO_EDGE,[Nr]:r.MIRRORED_REPEAT},pe={[Bt]:r.NEAREST,[oh]:r.NEAREST_MIPMAP_NEAREST,[vs]:r.NEAREST_MIPMAP_LINEAR,[Zt]:r.LINEAR,[Ar]:r.LINEAR_MIPMAP_NEAREST,[In]:r.LINEAR_MIPMAP_LINEAR},xe={[qd]:r.NEVER,[jd]:r.ALWAYS,[Yd]:r.LESS,[_h]:r.LEQUAL,[Kd]:r.EQUAL,[Jd]:r.GEQUAL,[Zd]:r.GREATER,[$d]:r.NOTEQUAL};function ze(b,x){if(x.type===cn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Zt||x.magFilter===Ar||x.magFilter===vs||x.magFilter===In||x.minFilter===Zt||x.minFilter===Ar||x.minFilter===vs||x.minFilter===In)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(b,r.TEXTURE_WRAP_S,ne[x.wrapS]),r.texParameteri(b,r.TEXTURE_WRAP_T,ne[x.wrapT]),(b===r.TEXTURE_3D||b===r.TEXTURE_2D_ARRAY)&&r.texParameteri(b,r.TEXTURE_WRAP_R,ne[x.wrapR]),r.texParameteri(b,r.TEXTURE_MAG_FILTER,pe[x.magFilter]),r.texParameteri(b,r.TEXTURE_MIN_FILTER,pe[x.minFilter]),x.compareFunction&&(r.texParameteri(b,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(b,r.TEXTURE_COMPARE_FUNC,xe[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Bt||x.minFilter!==vs&&x.minFilter!==In||x.type===cn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");r.texParameterf(b,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,i.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Ze(b,x){let F=!1;b.__webglInit===void 0&&(b.__webglInit=!0,x.addEventListener("dispose",R));const G=x.source;let Q=f.get(G);Q===void 0&&(Q={},f.set(G,Q));const q=W(x);if(q!==b.__cacheKey){Q[q]===void 0&&(Q[q]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,F=!0),Q[q].usedTimes++;const Ce=Q[b.__cacheKey];Ce!==void 0&&(Q[b.__cacheKey].usedTimes--,Ce.usedTimes===0&&M(x)),b.__cacheKey=q,b.__webglTexture=Q[q].texture}return F}function nt(b,x,F){return Math.floor(Math.floor(b/F)/x)}function Qe(b,x,F,G){const q=b.updateRanges;if(q.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,x.width,x.height,F,G,x.data);else{q.sort((se,_e)=>se.start-_e.start);let Ce=0;for(let se=1;se<q.length;se++){const _e=q[Ce],Oe=q[se],Pe=_e.start+_e.count,me=nt(Oe.start,x.width,4),We=nt(_e.start,x.width,4);Oe.start<=Pe+1&&me===We&&nt(Oe.start+Oe.count-1,x.width,4)===me?_e.count=Math.max(_e.count,Oe.start+Oe.count-_e.start):(++Ce,q[Ce]=Oe)}q.length=Ce+1;const ce=r.getParameter(r.UNPACK_ROW_LENGTH),be=r.getParameter(r.UNPACK_SKIP_PIXELS),Ae=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,x.width);for(let se=0,_e=q.length;se<_e;se++){const Oe=q[se],Pe=Math.floor(Oe.start/4),me=Math.ceil(Oe.count/4),We=Pe%x.width,D=Math.floor(Pe/x.width),oe=me,ue=1;r.pixelStorei(r.UNPACK_SKIP_PIXELS,We),r.pixelStorei(r.UNPACK_SKIP_ROWS,D),t.texSubImage2D(r.TEXTURE_2D,0,We,D,oe,ue,F,G,x.data)}b.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,ce),r.pixelStorei(r.UNPACK_SKIP_PIXELS,be),r.pixelStorei(r.UNPACK_SKIP_ROWS,Ae)}}function Y(b,x,F){let G=r.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(G=r.TEXTURE_2D_ARRAY),x.isData3DTexture&&(G=r.TEXTURE_3D);const Q=Ze(b,x),q=x.source;t.bindTexture(G,b.__webglTexture,r.TEXTURE0+F);const Ce=n.get(q);if(q.version!==Ce.__version||Q===!0){t.activeTexture(r.TEXTURE0+F);const ce=je.getPrimaries(je.workingColorSpace),be=x.colorSpace===Yn?null:je.getPrimaries(x.colorSpace),Ae=x.colorSpace===Yn||ce===be?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,x.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,x.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);let se=_(x.image,!1,i.maxTextureSize);se=Ve(x,se);const _e=s.convert(x.format,x.colorSpace),Oe=s.convert(x.type);let Pe=S(x.internalFormat,_e,Oe,x.colorSpace,x.isVideoTexture);ze(G,x);let me;const We=x.mipmaps,D=x.isVideoTexture!==!0,oe=Ce.__version===void 0||Q===!0,ue=q.dataReady,Ee=A(x,se);if(x.isDepthTexture)Pe=v(x.format===Cs,x.type),oe&&(D?t.texStorage2D(r.TEXTURE_2D,1,Pe,se.width,se.height):t.texImage2D(r.TEXTURE_2D,0,Pe,se.width,se.height,0,_e,Oe,null));else if(x.isDataTexture)if(We.length>0){D&&oe&&t.texStorage2D(r.TEXTURE_2D,Ee,Pe,We[0].width,We[0].height);for(let re=0,j=We.length;re<j;re++)me=We[re],D?ue&&t.texSubImage2D(r.TEXTURE_2D,re,0,0,me.width,me.height,_e,Oe,me.data):t.texImage2D(r.TEXTURE_2D,re,Pe,me.width,me.height,0,_e,Oe,me.data);x.generateMipmaps=!1}else D?(oe&&t.texStorage2D(r.TEXTURE_2D,Ee,Pe,se.width,se.height),ue&&Qe(x,se,_e,Oe)):t.texImage2D(r.TEXTURE_2D,0,Pe,se.width,se.height,0,_e,Oe,se.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){D&&oe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Ee,Pe,We[0].width,We[0].height,se.depth);for(let re=0,j=We.length;re<j;re++)if(me=We[re],x.format!==nn)if(_e!==null)if(D){if(ue)if(x.layerUpdates.size>0){const Re=_c(me.width,me.height,x.format,x.type);for(const Ge of x.layerUpdates){const pt=me.data.subarray(Ge*Re/me.data.BYTES_PER_ELEMENT,(Ge+1)*Re/me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,re,0,0,Ge,me.width,me.height,1,_e,pt)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,re,0,0,0,me.width,me.height,se.depth,_e,me.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,re,Pe,me.width,me.height,se.depth,0,me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?ue&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,re,0,0,0,me.width,me.height,se.depth,_e,Oe,me.data):t.texImage3D(r.TEXTURE_2D_ARRAY,re,Pe,me.width,me.height,se.depth,0,_e,Oe,me.data)}else{D&&oe&&t.texStorage2D(r.TEXTURE_2D,Ee,Pe,We[0].width,We[0].height);for(let re=0,j=We.length;re<j;re++)me=We[re],x.format!==nn?_e!==null?D?ue&&t.compressedTexSubImage2D(r.TEXTURE_2D,re,0,0,me.width,me.height,_e,me.data):t.compressedTexImage2D(r.TEXTURE_2D,re,Pe,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?ue&&t.texSubImage2D(r.TEXTURE_2D,re,0,0,me.width,me.height,_e,Oe,me.data):t.texImage2D(r.TEXTURE_2D,re,Pe,me.width,me.height,0,_e,Oe,me.data)}else if(x.isDataArrayTexture)if(D){if(oe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Ee,Pe,se.width,se.height,se.depth),ue)if(x.layerUpdates.size>0){const re=_c(se.width,se.height,x.format,x.type);for(const j of x.layerUpdates){const Re=se.data.subarray(j*re/se.data.BYTES_PER_ELEMENT,(j+1)*re/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,j,se.width,se.height,1,_e,Oe,Re)}x.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,_e,Oe,se.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,Pe,se.width,se.height,se.depth,0,_e,Oe,se.data);else if(x.isData3DTexture)D?(oe&&t.texStorage3D(r.TEXTURE_3D,Ee,Pe,se.width,se.height,se.depth),ue&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,_e,Oe,se.data)):t.texImage3D(r.TEXTURE_3D,0,Pe,se.width,se.height,se.depth,0,_e,Oe,se.data);else if(x.isFramebufferTexture){if(oe)if(D)t.texStorage2D(r.TEXTURE_2D,Ee,Pe,se.width,se.height);else{let re=se.width,j=se.height;for(let Re=0;Re<Ee;Re++)t.texImage2D(r.TEXTURE_2D,Re,Pe,re,j,0,_e,Oe,null),re>>=1,j>>=1}}else if(We.length>0){if(D&&oe){const re=ke(We[0]);t.texStorage2D(r.TEXTURE_2D,Ee,Pe,re.width,re.height)}for(let re=0,j=We.length;re<j;re++)me=We[re],D?ue&&t.texSubImage2D(r.TEXTURE_2D,re,0,0,_e,Oe,me):t.texImage2D(r.TEXTURE_2D,re,Pe,_e,Oe,me);x.generateMipmaps=!1}else if(D){if(oe){const re=ke(se);t.texStorage2D(r.TEXTURE_2D,Ee,Pe,re.width,re.height)}ue&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,_e,Oe,se)}else t.texImage2D(r.TEXTURE_2D,0,Pe,_e,Oe,se);p(x)&&m(G),Ce.__version=q.version,x.onUpdate&&x.onUpdate(x)}b.__version=x.version}function te(b,x,F){if(x.image.length!==6)return;const G=Ze(b,x),Q=x.source;t.bindTexture(r.TEXTURE_CUBE_MAP,b.__webglTexture,r.TEXTURE0+F);const q=n.get(Q);if(Q.version!==q.__version||G===!0){t.activeTexture(r.TEXTURE0+F);const Ce=je.getPrimaries(je.workingColorSpace),ce=x.colorSpace===Yn?null:je.getPrimaries(x.colorSpace),be=x.colorSpace===Yn||Ce===ce?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,x.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,x.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);const Ae=x.isCompressedTexture||x.image[0].isCompressedTexture,se=x.image[0]&&x.image[0].isDataTexture,_e=[];for(let j=0;j<6;j++)!Ae&&!se?_e[j]=_(x.image[j],!0,i.maxCubemapSize):_e[j]=se?x.image[j].image:x.image[j],_e[j]=Ve(x,_e[j]);const Oe=_e[0],Pe=s.convert(x.format,x.colorSpace),me=s.convert(x.type),We=S(x.internalFormat,Pe,me,x.colorSpace),D=x.isVideoTexture!==!0,oe=q.__version===void 0||G===!0,ue=Q.dataReady;let Ee=A(x,Oe);ze(r.TEXTURE_CUBE_MAP,x);let re;if(Ae){D&&oe&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Ee,We,Oe.width,Oe.height);for(let j=0;j<6;j++){re=_e[j].mipmaps;for(let Re=0;Re<re.length;Re++){const Ge=re[Re];x.format!==nn?Pe!==null?D?ue&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,Re,0,0,Ge.width,Ge.height,Pe,Ge.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,Re,We,Ge.width,Ge.height,0,Ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?ue&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,Re,0,0,Ge.width,Ge.height,Pe,me,Ge.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,Re,We,Ge.width,Ge.height,0,Pe,me,Ge.data)}}}else{if(re=x.mipmaps,D&&oe){re.length>0&&Ee++;const j=ke(_e[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,Ee,We,j.width,j.height)}for(let j=0;j<6;j++)if(se){D?ue&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,_e[j].width,_e[j].height,Pe,me,_e[j].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,We,_e[j].width,_e[j].height,0,Pe,me,_e[j].data);for(let Re=0;Re<re.length;Re++){const pt=re[Re].image[j].image;D?ue&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,Re+1,0,0,pt.width,pt.height,Pe,me,pt.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,Re+1,We,pt.width,pt.height,0,Pe,me,pt.data)}}else{D?ue&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Pe,me,_e[j]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,We,Pe,me,_e[j]);for(let Re=0;Re<re.length;Re++){const Ge=re[Re];D?ue&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,Re+1,0,0,Pe,me,Ge.image[j]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+j,Re+1,We,Pe,me,Ge.image[j])}}}p(x)&&m(r.TEXTURE_CUBE_MAP),q.__version=Q.version,x.onUpdate&&x.onUpdate(x)}b.__version=x.version}function Me(b,x,F,G,Q,q){const Ce=s.convert(F.format,F.colorSpace),ce=s.convert(F.type),be=S(F.internalFormat,Ce,ce,F.colorSpace),Ae=n.get(x),se=n.get(F);if(se.__renderTarget=x,!Ae.__hasExternalTextures){const _e=Math.max(1,x.width>>q),Oe=Math.max(1,x.height>>q);Q===r.TEXTURE_3D||Q===r.TEXTURE_2D_ARRAY?t.texImage3D(Q,q,be,_e,Oe,x.depth,0,Ce,ce,null):t.texImage2D(Q,q,be,_e,Oe,0,Ce,ce,null)}t.bindFramebuffer(r.FRAMEBUFFER,b),ie(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,G,Q,se.__webglTexture,0,he(x)):(Q===r.TEXTURE_2D||Q>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,G,Q,se.__webglTexture,q),t.bindFramebuffer(r.FRAMEBUFFER,null)}function Le(b,x,F){if(r.bindRenderbuffer(r.RENDERBUFFER,b),x.depthBuffer){const G=x.depthTexture,Q=G&&G.isDepthTexture?G.type:null,q=v(x.stencilBuffer,Q),Ce=x.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ce=he(x);ie(x)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ce,q,x.width,x.height):F?r.renderbufferStorageMultisample(r.RENDERBUFFER,ce,q,x.width,x.height):r.renderbufferStorage(r.RENDERBUFFER,q,x.width,x.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Ce,r.RENDERBUFFER,b)}else{const G=x.textures;for(let Q=0;Q<G.length;Q++){const q=G[Q],Ce=s.convert(q.format,q.colorSpace),ce=s.convert(q.type),be=S(q.internalFormat,Ce,ce,q.colorSpace),Ae=he(x);F&&ie(x)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ae,be,x.width,x.height):ie(x)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ae,be,x.width,x.height):r.renderbufferStorage(r.RENDERBUFFER,be,x.width,x.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function we(b,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,b),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const G=n.get(x.depthTexture);G.__renderTarget=x,(!G.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),z(x.depthTexture,0);const Q=G.__webglTexture,q=he(x);if(x.depthTexture.format===Rs)ie(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Q,0,q):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,Q,0);else if(x.depthTexture.format===Cs)ie(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Q,0,q):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function $e(b){const x=n.get(b),F=b.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==b.depthTexture){const G=b.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),G){const Q=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,G.removeEventListener("dispose",Q)};G.addEventListener("dispose",Q),x.__depthDisposeCallback=Q}x.__boundDepthTexture=G}if(b.depthTexture&&!x.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");const G=b.texture.mipmaps;G&&G.length>0?we(x.__webglFramebuffer[0],b):we(x.__webglFramebuffer,b)}else if(F){x.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer[G]),x.__webglDepthbuffer[G]===void 0)x.__webglDepthbuffer[G]=r.createRenderbuffer(),Le(x.__webglDepthbuffer[G],b,!1);else{const Q=b.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,q=x.__webglDepthbuffer[G];r.bindRenderbuffer(r.RENDERBUFFER,q),r.framebufferRenderbuffer(r.FRAMEBUFFER,Q,r.RENDERBUFFER,q)}}else{const G=b.texture.mipmaps;if(G&&G.length>0?t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=r.createRenderbuffer(),Le(x.__webglDepthbuffer,b,!1);else{const Q=b.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,q=x.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,q),r.framebufferRenderbuffer(r.FRAMEBUFFER,Q,r.RENDERBUFFER,q)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function ft(b,x,F){const G=n.get(b);x!==void 0&&Me(G.__webglFramebuffer,b,b.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),F!==void 0&&$e(b)}function I(b){const x=b.texture,F=n.get(b),G=n.get(x);b.addEventListener("dispose",P);const Q=b.textures,q=b.isWebGLCubeRenderTarget===!0,Ce=Q.length>1;if(Ce||(G.__webglTexture===void 0&&(G.__webglTexture=r.createTexture()),G.__version=x.version,a.memory.textures++),q){F.__webglFramebuffer=[];for(let ce=0;ce<6;ce++)if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer[ce]=[];for(let be=0;be<x.mipmaps.length;be++)F.__webglFramebuffer[ce][be]=r.createFramebuffer()}else F.__webglFramebuffer[ce]=r.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer=[];for(let ce=0;ce<x.mipmaps.length;ce++)F.__webglFramebuffer[ce]=r.createFramebuffer()}else F.__webglFramebuffer=r.createFramebuffer();if(Ce)for(let ce=0,be=Q.length;ce<be;ce++){const Ae=n.get(Q[ce]);Ae.__webglTexture===void 0&&(Ae.__webglTexture=r.createTexture(),a.memory.textures++)}if(b.samples>0&&ie(b)===!1){F.__webglMultisampledFramebuffer=r.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ce=0;ce<Q.length;ce++){const be=Q[ce];F.__webglColorRenderbuffer[ce]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,F.__webglColorRenderbuffer[ce]);const Ae=s.convert(be.format,be.colorSpace),se=s.convert(be.type),_e=S(be.internalFormat,Ae,se,be.colorSpace,b.isXRRenderTarget===!0),Oe=he(b);r.renderbufferStorageMultisample(r.RENDERBUFFER,Oe,_e,b.width,b.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ce,r.RENDERBUFFER,F.__webglColorRenderbuffer[ce])}r.bindRenderbuffer(r.RENDERBUFFER,null),b.depthBuffer&&(F.__webglDepthRenderbuffer=r.createRenderbuffer(),Le(F.__webglDepthRenderbuffer,b,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(q){t.bindTexture(r.TEXTURE_CUBE_MAP,G.__webglTexture),ze(r.TEXTURE_CUBE_MAP,x);for(let ce=0;ce<6;ce++)if(x.mipmaps&&x.mipmaps.length>0)for(let be=0;be<x.mipmaps.length;be++)Me(F.__webglFramebuffer[ce][be],b,x,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ce,be);else Me(F.__webglFramebuffer[ce],b,x,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0);p(x)&&m(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ce){for(let ce=0,be=Q.length;ce<be;ce++){const Ae=Q[ce],se=n.get(Ae);let _e=r.TEXTURE_2D;(b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(_e=b.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(_e,se.__webglTexture),ze(_e,Ae),Me(F.__webglFramebuffer,b,Ae,r.COLOR_ATTACHMENT0+ce,_e,0),p(Ae)&&m(_e)}t.unbindTexture()}else{let ce=r.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(ce=b.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(ce,G.__webglTexture),ze(ce,x),x.mipmaps&&x.mipmaps.length>0)for(let be=0;be<x.mipmaps.length;be++)Me(F.__webglFramebuffer[be],b,x,r.COLOR_ATTACHMENT0,ce,be);else Me(F.__webglFramebuffer,b,x,r.COLOR_ATTACHMENT0,ce,0);p(x)&&m(ce),t.unbindTexture()}b.depthBuffer&&$e(b)}function ee(b){const x=b.textures;for(let F=0,G=x.length;F<G;F++){const Q=x[F];if(p(Q)){const q=w(b),Ce=n.get(Q).__webglTexture;t.bindTexture(q,Ce),m(q),t.unbindTexture()}}}const J=[],$=[];function K(b){if(b.samples>0){if(ie(b)===!1){const x=b.textures,F=b.width,G=b.height;let Q=r.COLOR_BUFFER_BIT;const q=b.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ce=n.get(b),ce=x.length>1;if(ce)for(let Ae=0;Ae<x.length;Ae++)t.bindFramebuffer(r.FRAMEBUFFER,Ce.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ae,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,Ce.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ae,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,Ce.__webglMultisampledFramebuffer);const be=b.texture.mipmaps;be&&be.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ce.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ce.__webglFramebuffer);for(let Ae=0;Ae<x.length;Ae++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(Q|=r.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(Q|=r.STENCIL_BUFFER_BIT)),ce){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Ce.__webglColorRenderbuffer[Ae]);const se=n.get(x[Ae]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,se,0)}r.blitFramebuffer(0,0,F,G,0,0,F,G,Q,r.NEAREST),l===!0&&(J.length=0,$.length=0,J.push(r.COLOR_ATTACHMENT0+Ae),b.depthBuffer&&b.resolveDepthBuffer===!1&&(J.push(q),$.push(q),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,$)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,J))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),ce)for(let Ae=0;Ae<x.length;Ae++){t.bindFramebuffer(r.FRAMEBUFFER,Ce.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ae,r.RENDERBUFFER,Ce.__webglColorRenderbuffer[Ae]);const se=n.get(x[Ae]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,Ce.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ae,r.TEXTURE_2D,se,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ce.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){const x=b.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[x])}}}function he(b){return Math.min(i.maxSamples,b.samples)}function ie(b){const x=n.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function de(b){const x=a.render.frame;h.get(b)!==x&&(h.set(b,x),b.update())}function Ve(b,x){const F=b.colorSpace,G=b.format,Q=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||F!==Ht&&F!==Yn&&(je.getTransfer(F)===ht?(G!==nn||Q!==vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),x}function ke(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=U,this.setTexture2D=z,this.setTexture2DArray=X,this.setTexture3D=Z,this.setTextureCube=V,this.rebindTextures=ft,this.setupRenderTarget=I,this.updateRenderTargetMipmap=ee,this.updateMultisampleRenderTarget=K,this.setupDepthRenderbuffer=$e,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=ie}function H_(r,e){function t(n,i=Yn){let s;const a=je.getTransfer(i);if(n===vn)return r.UNSIGNED_BYTE;if(n===zo)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Vo)return r.UNSIGNED_SHORT_5_5_5_1;if(n===hh)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===dh)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===lh)return r.BYTE;if(n===ch)return r.SHORT;if(n===bs)return r.UNSIGNED_SHORT;if(n===Ho)return r.INT;if(n===ui)return r.UNSIGNED_INT;if(n===cn)return r.FLOAT;if(n===ks)return r.HALF_FLOAT;if(n===uh)return r.ALPHA;if(n===fh)return r.RGB;if(n===nn)return r.RGBA;if(n===Rs)return r.DEPTH_COMPONENT;if(n===Cs)return r.DEPTH_STENCIL;if(n===Go)return r.RED;if(n===Wo)return r.RED_INTEGER;if(n===ph)return r.RG;if(n===Xo)return r.RG_INTEGER;if(n===qo)return r.RGBA_INTEGER;if(n===Rr||n===Cr||n===Pr||n===Lr)if(a===ht)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Rr)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Cr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Pr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Lr)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Rr)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Cr)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Pr)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Lr)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ja||n===ja||n===Qa||n===eo)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Ja)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ja)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Qa)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===eo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===to||n===no||n===io)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===to||n===no)return a===ht?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===io)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===so||n===ro||n===ao||n===oo||n===lo||n===co||n===ho||n===uo||n===fo||n===po||n===mo||n===go||n===_o||n===vo)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===so)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ro)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ao)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===oo)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===lo)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===co)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ho)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===uo)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===fo)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===po)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===mo)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===go)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===_o)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===vo)return a===ht?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===xo||n===So||n===yo)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===xo)return a===ht?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===So)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===yo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Mo||n===Eo||n===To||n===wo)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Mo)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Eo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===To)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===wo)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===As?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:t}}const z_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,V_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class G_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Nh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new jn({vertexShader:z_,fragmentShader:V_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Se(new xt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class W_ extends ji{constructor(e,t){super();const n=this;let i=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,f=null,u=null,g=null;const _=typeof XRWebGLBinding<"u",p=new G_,m={},w=t.getContextAttributes();let S=null,v=null;const A=[],R=[],P=new le;let C=null;const M=new wt;M.viewport=new it;const y=new wt;y.viewport=new it;const L=[M,y],U=new tp;let B=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let te=A[Y];return te===void 0&&(te=new ma,A[Y]=te),te.getTargetRaySpace()},this.getControllerGrip=function(Y){let te=A[Y];return te===void 0&&(te=new ma,A[Y]=te),te.getGripSpace()},this.getHand=function(Y){let te=A[Y];return te===void 0&&(te=new ma,A[Y]=te),te.getHandSpace()};function z(Y){const te=R.indexOf(Y.inputSource);if(te===-1)return;const Me=A[te];Me!==void 0&&(Me.update(Y.inputSource,Y.frame,c||a),Me.dispatchEvent({type:Y.type,data:Y.inputSource}))}function X(){i.removeEventListener("select",z),i.removeEventListener("selectstart",z),i.removeEventListener("selectend",z),i.removeEventListener("squeeze",z),i.removeEventListener("squeezestart",z),i.removeEventListener("squeezeend",z),i.removeEventListener("end",X),i.removeEventListener("inputsourceschange",Z);for(let Y=0;Y<A.length;Y++){const te=R[Y];te!==null&&(R[Y]=null,A[Y].disconnect(te))}B=null,W=null,p.reset();for(const Y in m)delete m[Y];e.setRenderTarget(S),u=null,f=null,d=null,i=null,v=null,Qe.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return f!==null?f:u},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(i,t)),d},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(S=e.getRenderTarget(),i.addEventListener("select",z),i.addEventListener("selectstart",z),i.addEventListener("selectend",z),i.addEventListener("squeeze",z),i.addEventListener("squeezestart",z),i.addEventListener("squeezeend",z),i.addEventListener("end",X),i.addEventListener("inputsourceschange",Z),w.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(P),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Me=null,Le=null,we=null;w.depth&&(we=w.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Me=w.stencil?Cs:Rs,Le=w.stencil?As:ui);const $e={colorFormat:t.RGBA8,depthFormat:we,scaleFactor:s};d=this.getBinding(),f=d.createProjectionLayer($e),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new Jn(f.textureWidth,f.textureHeight,{format:nn,type:vn,depthTexture:new Dh(f.textureWidth,f.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,Me),stencilBuffer:w.stencil,colorSpace:e.outputColorSpace,samples:w.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const Me={antialias:w.antialias,alpha:!0,depth:w.depth,stencil:w.stencil,framebufferScaleFactor:s};u=new XRWebGLLayer(i,t,Me),i.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),v=new Jn(u.framebufferWidth,u.framebufferHeight,{format:nn,type:vn,colorSpace:e.outputColorSpace,stencilBuffer:w.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Qe.setContext(i),Qe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function Z(Y){for(let te=0;te<Y.removed.length;te++){const Me=Y.removed[te],Le=R.indexOf(Me);Le>=0&&(R[Le]=null,A[Le].disconnect(Me))}for(let te=0;te<Y.added.length;te++){const Me=Y.added[te];let Le=R.indexOf(Me);if(Le===-1){for(let $e=0;$e<A.length;$e++)if($e>=R.length){R.push(Me),Le=$e;break}else if(R[$e]===null){R[$e]=Me,Le=$e;break}if(Le===-1)break}const we=A[Le];we&&we.connect(Me)}}const V=new E,ne=new E;function pe(Y,te,Me){V.setFromMatrixPosition(te.matrixWorld),ne.setFromMatrixPosition(Me.matrixWorld);const Le=V.distanceTo(ne),we=te.projectionMatrix.elements,$e=Me.projectionMatrix.elements,ft=we[14]/(we[10]-1),I=we[14]/(we[10]+1),ee=(we[9]+1)/we[5],J=(we[9]-1)/we[5],$=(we[8]-1)/we[0],K=($e[8]+1)/$e[0],he=ft*$,ie=ft*K,de=Le/(-$+K),Ve=de*-$;if(te.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Ve),Y.translateZ(de),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),we[10]===-1)Y.projectionMatrix.copy(te.projectionMatrix),Y.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{const ke=ft+de,b=I+de,x=he-Ve,F=ie+(Le-Ve),G=ee*I/b*ke,Q=J*I/b*ke;Y.projectionMatrix.makePerspective(x,F,G,Q,ke,b),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function xe(Y,te){te===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(te.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let te=Y.near,Me=Y.far;p.texture!==null&&(p.depthNear>0&&(te=p.depthNear),p.depthFar>0&&(Me=p.depthFar)),U.near=y.near=M.near=te,U.far=y.far=M.far=Me,(B!==U.near||W!==U.far)&&(i.updateRenderState({depthNear:U.near,depthFar:U.far}),B=U.near,W=U.far),U.layers.mask=Y.layers.mask|6,M.layers.mask=U.layers.mask&3,y.layers.mask=U.layers.mask&5;const Le=Y.parent,we=U.cameras;xe(U,Le);for(let $e=0;$e<we.length;$e++)xe(we[$e],Le);we.length===2?pe(U,M,y):U.projectionMatrix.copy(M.projectionMatrix),ze(Y,U,Le)};function ze(Y,te,Me){Me===null?Y.matrix.copy(te.matrixWorld):(Y.matrix.copy(Me.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(te.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(te.projectionMatrix),Y.projectionMatrixInverse.copy(te.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=qi*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(f===null&&u===null))return l},this.setFoveation=function(Y){l=Y,f!==null&&(f.fixedFoveation=Y),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=Y)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(U)},this.getCameraTexture=function(Y){return m[Y]};let Ze=null;function nt(Y,te){if(h=te.getViewerPose(c||a),g=te,h!==null){const Me=h.views;u!==null&&(e.setRenderTargetFramebuffer(v,u.framebuffer),e.setRenderTarget(v));let Le=!1;Me.length!==U.cameras.length&&(U.cameras.length=0,Le=!0);for(let I=0;I<Me.length;I++){const ee=Me[I];let J=null;if(u!==null)J=u.getViewport(ee);else{const K=d.getViewSubImage(f,ee);J=K.viewport,I===0&&(e.setRenderTargetTextures(v,K.colorTexture,K.depthStencilTexture),e.setRenderTarget(v))}let $=L[I];$===void 0&&($=new wt,$.layers.enable(I),$.viewport=new it,L[I]=$),$.matrix.fromArray(ee.transform.matrix),$.matrix.decompose($.position,$.quaternion,$.scale),$.projectionMatrix.fromArray(ee.projectionMatrix),$.projectionMatrixInverse.copy($.projectionMatrix).invert(),$.viewport.set(J.x,J.y,J.width,J.height),I===0&&(U.matrix.copy($.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Le===!0&&U.cameras.push($)}const we=i.enabledFeatures;if(we&&we.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){d=n.getBinding();const I=d.getDepthInformation(Me[0]);I&&I.isValid&&I.texture&&p.init(I,i.renderState)}if(we&&we.includes("camera-access")&&_){e.state.unbindTexture(),d=n.getBinding();for(let I=0;I<Me.length;I++){const ee=Me[I].camera;if(ee){let J=m[ee];J||(J=new Nh,m[ee]=J);const $=d.getCameraImage(ee);J.sourceTexture=$}}}}for(let Me=0;Me<A.length;Me++){const Le=R[Me],we=A[Me];Le!==null&&we!==void 0&&we.update(Le,te,c||a)}Ze&&Ze(Y,te),te.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:te}),g=null}const Qe=new Kh;Qe.setAnimationLoop(nt),this.setAnimationLoop=function(Y){Ze=Y},this.dispose=function(){}}}const ai=new xn,X_=new He;function q_(r,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Eh(r)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,w,S,v){m.isMeshBasicMaterial||m.isMeshLambertMaterial?s(p,m):m.isMeshToonMaterial?(s(p,m),d(p,m)):m.isMeshPhongMaterial?(s(p,m),h(p,m)):m.isMeshStandardMaterial?(s(p,m),f(p,m),m.isMeshPhysicalMaterial&&u(p,m,v)):m.isMeshMatcapMaterial?(s(p,m),g(p,m)):m.isMeshDepthMaterial?s(p,m):m.isMeshDistanceMaterial?(s(p,m),_(p,m)):m.isMeshNormalMaterial?s(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?l(p,m,w,S):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Gt&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Gt&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const w=e.get(m),S=w.envMap,v=w.envMapRotation;S&&(p.envMap.value=S,ai.copy(v),ai.x*=-1,ai.y*=-1,ai.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(ai.y*=-1,ai.z*=-1),p.envMapRotation.value.setFromMatrix4(X_.makeRotationFromEuler(ai)),p.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,w,S){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*w,p.scale.value=S*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function f(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function u(p,m,w){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Gt&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=w.texture,p.transmissionSamplerSize.value.set(w.width,w.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function _(p,m){const w=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(w.matrixWorld),p.nearDistance.value=w.shadow.camera.near,p.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Y_(r,e,t,n){let i={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(w,S){const v=S.program;n.uniformBlockBinding(w,v)}function c(w,S){let v=i[w.id];v===void 0&&(g(w),v=h(w),i[w.id]=v,w.addEventListener("dispose",p));const A=S.program;n.updateUBOMapping(w,A);const R=e.render.frame;s[w.id]!==R&&(f(w),s[w.id]=R)}function h(w){const S=d();w.__bindingPointIndex=S;const v=r.createBuffer(),A=w.__size,R=w.usage;return r.bindBuffer(r.UNIFORM_BUFFER,v),r.bufferData(r.UNIFORM_BUFFER,A,R),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,S,v),v}function d(){for(let w=0;w<o;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(w){const S=i[w.id],v=w.uniforms,A=w.__cache;r.bindBuffer(r.UNIFORM_BUFFER,S);for(let R=0,P=v.length;R<P;R++){const C=Array.isArray(v[R])?v[R]:[v[R]];for(let M=0,y=C.length;M<y;M++){const L=C[M];if(u(L,R,M,A)===!0){const U=L.__offset,B=Array.isArray(L.value)?L.value:[L.value];let W=0;for(let z=0;z<B.length;z++){const X=B[z],Z=_(X);typeof X=="number"||typeof X=="boolean"?(L.__data[0]=X,r.bufferSubData(r.UNIFORM_BUFFER,U+W,L.__data)):X.isMatrix3?(L.__data[0]=X.elements[0],L.__data[1]=X.elements[1],L.__data[2]=X.elements[2],L.__data[3]=0,L.__data[4]=X.elements[3],L.__data[5]=X.elements[4],L.__data[6]=X.elements[5],L.__data[7]=0,L.__data[8]=X.elements[6],L.__data[9]=X.elements[7],L.__data[10]=X.elements[8],L.__data[11]=0):(X.toArray(L.__data,W),W+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,U,L.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function u(w,S,v,A){const R=w.value,P=S+"_"+v;if(A[P]===void 0)return typeof R=="number"||typeof R=="boolean"?A[P]=R:A[P]=R.clone(),!0;{const C=A[P];if(typeof R=="number"||typeof R=="boolean"){if(C!==R)return A[P]=R,!0}else if(C.equals(R)===!1)return C.copy(R),!0}return!1}function g(w){const S=w.uniforms;let v=0;const A=16;for(let P=0,C=S.length;P<C;P++){const M=Array.isArray(S[P])?S[P]:[S[P]];for(let y=0,L=M.length;y<L;y++){const U=M[y],B=Array.isArray(U.value)?U.value:[U.value];for(let W=0,z=B.length;W<z;W++){const X=B[W],Z=_(X),V=v%A,ne=V%Z.boundary,pe=V+ne;v+=ne,pe!==0&&A-pe<Z.storage&&(v+=A-pe),U.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=v,v+=Z.storage}}}const R=v%A;return R>0&&(v+=A-R),w.__size=v,w.__cache={},this}function _(w){const S={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(S.boundary=4,S.storage=4):w.isVector2?(S.boundary=8,S.storage=8):w.isVector3||w.isColor?(S.boundary=16,S.storage=12):w.isVector4?(S.boundary=16,S.storage=16):w.isMatrix3?(S.boundary=48,S.storage=48):w.isMatrix4?(S.boundary=64,S.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),S}function p(w){const S=w.target;S.removeEventListener("dispose",p);const v=a.indexOf(S.__bindingPointIndex);a.splice(v,1),r.deleteBuffer(i[S.id]),delete i[S.id],delete s[S.id]}function m(){for(const w in i)r.deleteBuffer(i[w]);a=[],i={},s={}}return{bind:l,update:c,dispose:m}}class K_{constructor(e={}){const{canvas:t=mu(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=a;const g=new Uint32Array(4),_=new Int32Array(4);let p=null,m=null;const w=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=$n,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const v=this;let A=!1;this._outputColorSpace=lt;let R=0,P=0,C=null,M=-1,y=null;const L=new it,U=new it;let B=null;const W=new Fe(0);let z=0,X=t.width,Z=t.height,V=1,ne=null,pe=null;const xe=new it(0,0,X,Z),ze=new it(0,0,X,Z);let Ze=!1;const nt=new jo;let Qe=!1,Y=!1;const te=new He,Me=new E,Le=new it,we={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let $e=!1;function ft(){return C===null?V:1}let I=n;function ee(T,N){return t.getContext(T,N)}try{const T={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ko}`),t.addEventListener("webglcontextlost",ue,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",re,!1),I===null){const N="webgl2";if(I=ee(N,T),I===null)throw ee(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let J,$,K,he,ie,de,Ve,ke,b,x,F,G,Q,q,Ce,ce,be,Ae,se,_e,Oe,Pe,me,We;function D(){J=new s0(I),J.init(),Pe=new H_(I,J),$=new Jg(I,J,e,Pe),K=new B_(I,J),$.reversedDepthBuffer&&f&&K.buffers.depth.setReversed(!0),he=new o0(I),ie=new w_,de=new k_(I,J,K,ie,$,Pe,he),Ve=new Qg(v),ke=new i0(v),b=new fp(I),me=new Zg(I,b),x=new r0(I,b,he,me),F=new c0(I,x,b,he),se=new l0(I,$,de),ce=new jg(ie),G=new T_(v,Ve,ke,J,$,me,ce),Q=new q_(v,ie),q=new A_,Ce=new D_(J),Ae=new Kg(v,Ve,ke,K,F,u,l),be=new U_(v,F,$),We=new Y_(I,he,$,K),_e=new $g(I,J,he),Oe=new a0(I,J,he),he.programs=G.programs,v.capabilities=$,v.extensions=J,v.properties=ie,v.renderLists=q,v.shadowMap=be,v.state=K,v.info=he}D();const oe=new W_(v,I);this.xr=oe,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const T=J.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=J.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(T){T!==void 0&&(V=T,this.setSize(X,Z,!1))},this.getSize=function(T){return T.set(X,Z)},this.setSize=function(T,N,k=!0){if(oe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=T,Z=N,t.width=Math.floor(T*V),t.height=Math.floor(N*V),k===!0&&(t.style.width=T+"px",t.style.height=N+"px"),this.setViewport(0,0,T,N)},this.getDrawingBufferSize=function(T){return T.set(X*V,Z*V).floor()},this.setDrawingBufferSize=function(T,N,k){X=T,Z=N,V=k,t.width=Math.floor(T*k),t.height=Math.floor(N*k),this.setViewport(0,0,T,N)},this.getCurrentViewport=function(T){return T.copy(L)},this.getViewport=function(T){return T.copy(xe)},this.setViewport=function(T,N,k,H){T.isVector4?xe.set(T.x,T.y,T.z,T.w):xe.set(T,N,k,H),K.viewport(L.copy(xe).multiplyScalar(V).round())},this.getScissor=function(T){return T.copy(ze)},this.setScissor=function(T,N,k,H){T.isVector4?ze.set(T.x,T.y,T.z,T.w):ze.set(T,N,k,H),K.scissor(U.copy(ze).multiplyScalar(V).round())},this.getScissorTest=function(){return Ze},this.setScissorTest=function(T){K.setScissorTest(Ze=T)},this.setOpaqueSort=function(T){ne=T},this.setTransparentSort=function(T){pe=T},this.getClearColor=function(T){return T.copy(Ae.getClearColor())},this.setClearColor=function(){Ae.setClearColor(...arguments)},this.getClearAlpha=function(){return Ae.getClearAlpha()},this.setClearAlpha=function(){Ae.setClearAlpha(...arguments)},this.clear=function(T=!0,N=!0,k=!0){let H=0;if(T){let O=!1;if(C!==null){const ae=C.texture.format;O=ae===qo||ae===Xo||ae===Wo}if(O){const ae=C.texture.type,ge=ae===vn||ae===ui||ae===bs||ae===As||ae===zo||ae===Vo,Te=Ae.getClearColor(),ye=Ae.getClearAlpha(),Ne=Te.r,Ue=Te.g,Ie=Te.b;ge?(g[0]=Ne,g[1]=Ue,g[2]=Ie,g[3]=ye,I.clearBufferuiv(I.COLOR,0,g)):(_[0]=Ne,_[1]=Ue,_[2]=Ie,_[3]=ye,I.clearBufferiv(I.COLOR,0,_))}else H|=I.COLOR_BUFFER_BIT}N&&(H|=I.DEPTH_BUFFER_BIT),k&&(H|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ue,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",re,!1),Ae.dispose(),q.dispose(),Ce.dispose(),ie.dispose(),Ve.dispose(),ke.dispose(),F.dispose(),me.dispose(),We.dispose(),G.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",fn),oe.removeEventListener("sessionend",hl),Qn.stop()};function ue(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function Ee(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;const T=he.autoReset,N=be.enabled,k=be.autoUpdate,H=be.needsUpdate,O=be.type;D(),he.autoReset=T,be.enabled=N,be.autoUpdate=k,be.needsUpdate=H,be.type=O}function re(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function j(T){const N=T.target;N.removeEventListener("dispose",j),Re(N)}function Re(T){Ge(T),ie.remove(T)}function Ge(T){const N=ie.get(T).programs;N!==void 0&&(N.forEach(function(k){G.releaseProgram(k)}),T.isShaderMaterial&&G.releaseShaderCache(T))}this.renderBufferDirect=function(T,N,k,H,O,ae){N===null&&(N=we);const ge=O.isMesh&&O.matrixWorld.determinant()<0,Te=sd(T,N,k,H,O);K.setMaterial(H,ge);let ye=k.index,Ne=1;if(H.wireframe===!0){if(ye=x.getWireframeAttribute(k),ye===void 0)return;Ne=2}const Ue=k.drawRange,Ie=k.attributes.position;let Je=Ue.start*Ne,ct=(Ue.start+Ue.count)*Ne;ae!==null&&(Je=Math.max(Je,ae.start*Ne),ct=Math.min(ct,(ae.start+ae.count)*Ne)),ye!==null?(Je=Math.max(Je,0),ct=Math.min(ct,ye.count)):Ie!=null&&(Je=Math.max(Je,0),ct=Math.min(ct,Ie.count));const yt=ct-Je;if(yt<0||yt===1/0)return;me.setup(O,H,Te,k,ye);let mt,dt=_e;if(ye!==null&&(mt=b.get(ye),dt=Oe,dt.setIndex(mt)),O.isMesh)H.wireframe===!0?(K.setLineWidth(H.wireframeLinewidth*ft()),dt.setMode(I.LINES)):dt.setMode(I.TRIANGLES);else if(O.isLine){let De=H.linewidth;De===void 0&&(De=1),K.setLineWidth(De*ft()),O.isLineSegments?dt.setMode(I.LINES):O.isLineLoop?dt.setMode(I.LINE_LOOP):dt.setMode(I.LINE_STRIP)}else O.isPoints?dt.setMode(I.POINTS):O.isSprite&&dt.setMode(I.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)Ds("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),dt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(J.get("WEBGL_multi_draw"))dt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const De=O._multiDrawStarts,_t=O._multiDrawCounts,tt=O._multiDrawCount,Wt=ye?b.get(ye).bytesPerElement:1,mi=ie.get(H).currentProgram.getUniforms();for(let Xt=0;Xt<tt;Xt++)mi.setValue(I,"_gl_DrawID",Xt),dt.render(De[Xt]/Wt,_t[Xt])}else if(O.isInstancedMesh)dt.renderInstances(Je,yt,O.count);else if(k.isInstancedBufferGeometry){const De=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,_t=Math.min(k.instanceCount,De);dt.renderInstances(Je,yt,_t)}else dt.render(Je,yt)};function pt(T,N,k){T.transparent===!0&&T.side===Et&&T.forceSinglePass===!1?(T.side=Gt,T.needsUpdate=!0,Xs(T,N,k),T.side=Fn,T.needsUpdate=!0,Xs(T,N,k),T.side=Et):Xs(T,N,k)}this.compile=function(T,N,k=null){k===null&&(k=T),m=Ce.get(k),m.init(N),S.push(m),k.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),T!==k&&T.traverseVisible(function(O){O.isLight&&O.layers.test(N.layers)&&(m.pushLight(O),O.castShadow&&m.pushShadow(O))}),m.setupLights();const H=new Set;return T.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const ae=O.material;if(ae)if(Array.isArray(ae))for(let ge=0;ge<ae.length;ge++){const Te=ae[ge];pt(Te,k,O),H.add(Te)}else pt(ae,k,O),H.add(ae)}),m=S.pop(),H},this.compileAsync=function(T,N,k=null){const H=this.compile(T,N,k);return new Promise(O=>{function ae(){if(H.forEach(function(ge){ie.get(ge).currentProgram.isReady()&&H.delete(ge)}),H.size===0){O(T);return}setTimeout(ae,10)}J.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let st=null;function En(T){st&&st(T)}function fn(){Qn.stop()}function hl(){Qn.start()}const Qn=new Kh;Qn.setAnimationLoop(En),typeof self<"u"&&Qn.setContext(self),this.setAnimationLoop=function(T){st=T,oe.setAnimationLoop(T),T===null?Qn.stop():Qn.start()},oe.addEventListener("sessionstart",fn),oe.addEventListener("sessionend",hl),this.render=function(T,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(N),N=oe.getCamera()),T.isScene===!0&&T.onBeforeRender(v,T,N,C),m=Ce.get(T,S.length),m.init(N),S.push(m),te.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),nt.setFromProjectionMatrix(te,gn,N.reversedDepth),Y=this.localClippingEnabled,Qe=ce.init(this.clippingPlanes,Y),p=q.get(T,w.length),p.init(),w.push(p),oe.enabled===!0&&oe.isPresenting===!0){const ae=v.xr.getDepthSensingMesh();ae!==null&&qr(ae,N,-1/0,v.sortObjects)}qr(T,N,0,v.sortObjects),p.finish(),v.sortObjects===!0&&p.sort(ne,pe),$e=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,$e&&Ae.addToRenderList(p,T),this.info.render.frame++,Qe===!0&&ce.beginShadows();const k=m.state.shadowsArray;be.render(k,T,N),Qe===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=p.opaque,O=p.transmissive;if(m.setupLights(),N.isArrayCamera){const ae=N.cameras;if(O.length>0)for(let ge=0,Te=ae.length;ge<Te;ge++){const ye=ae[ge];ul(H,O,T,ye)}$e&&Ae.render(T);for(let ge=0,Te=ae.length;ge<Te;ge++){const ye=ae[ge];dl(p,T,ye,ye.viewport)}}else O.length>0&&ul(H,O,T,N),$e&&Ae.render(T),dl(p,T,N);C!==null&&P===0&&(de.updateMultisampleRenderTarget(C),de.updateRenderTargetMipmap(C)),T.isScene===!0&&T.onAfterRender(v,T,N),me.resetDefaultState(),M=-1,y=null,S.pop(),S.length>0?(m=S[S.length-1],Qe===!0&&ce.setGlobalState(v.clippingPlanes,m.state.camera)):m=null,w.pop(),w.length>0?p=w[w.length-1]:p=null};function qr(T,N,k,H){if(T.visible===!1)return;if(T.layers.test(N.layers)){if(T.isGroup)k=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(N);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||nt.intersectsSprite(T)){H&&Le.setFromMatrixPosition(T.matrixWorld).applyMatrix4(te);const ge=F.update(T),Te=T.material;Te.visible&&p.push(T,ge,Te,k,Le.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||nt.intersectsObject(T))){const ge=F.update(T),Te=T.material;if(H&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Le.copy(T.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),Le.copy(ge.boundingSphere.center)),Le.applyMatrix4(T.matrixWorld).applyMatrix4(te)),Array.isArray(Te)){const ye=ge.groups;for(let Ne=0,Ue=ye.length;Ne<Ue;Ne++){const Ie=ye[Ne],Je=Te[Ie.materialIndex];Je&&Je.visible&&p.push(T,ge,Je,k,Le.z,Ie)}}else Te.visible&&p.push(T,ge,Te,k,Le.z,null)}}const ae=T.children;for(let ge=0,Te=ae.length;ge<Te;ge++)qr(ae[ge],N,k,H)}function dl(T,N,k,H){const O=T.opaque,ae=T.transmissive,ge=T.transparent;m.setupLightsView(k),Qe===!0&&ce.setGlobalState(v.clippingPlanes,k),H&&K.viewport(L.copy(H)),O.length>0&&Ws(O,N,k),ae.length>0&&Ws(ae,N,k),ge.length>0&&Ws(ge,N,k),K.buffers.depth.setTest(!0),K.buffers.depth.setMask(!0),K.buffers.color.setMask(!0),K.setPolygonOffset(!1)}function ul(T,N,k,H){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[H.id]===void 0&&(m.state.transmissionRenderTarget[H.id]=new Jn(1,1,{generateMipmaps:!0,type:J.has("EXT_color_buffer_half_float")||J.has("EXT_color_buffer_float")?ks:vn,minFilter:In,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:je.workingColorSpace}));const ae=m.state.transmissionRenderTarget[H.id],ge=H.viewport||L;ae.setSize(ge.z*v.transmissionResolutionScale,ge.w*v.transmissionResolutionScale);const Te=v.getRenderTarget(),ye=v.getActiveCubeFace(),Ne=v.getActiveMipmapLevel();v.setRenderTarget(ae),v.getClearColor(W),z=v.getClearAlpha(),z<1&&v.setClearColor(16777215,.5),v.clear(),$e&&Ae.render(k);const Ue=v.toneMapping;v.toneMapping=$n;const Ie=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),m.setupLightsView(H),Qe===!0&&ce.setGlobalState(v.clippingPlanes,H),Ws(T,k,H),de.updateMultisampleRenderTarget(ae),de.updateRenderTargetMipmap(ae),J.has("WEBGL_multisampled_render_to_texture")===!1){let Je=!1;for(let ct=0,yt=N.length;ct<yt;ct++){const mt=N[ct],dt=mt.object,De=mt.geometry,_t=mt.material,tt=mt.group;if(_t.side===Et&&dt.layers.test(H.layers)){const Wt=_t.side;_t.side=Gt,_t.needsUpdate=!0,fl(dt,k,H,De,_t,tt),_t.side=Wt,_t.needsUpdate=!0,Je=!0}}Je===!0&&(de.updateMultisampleRenderTarget(ae),de.updateRenderTargetMipmap(ae))}v.setRenderTarget(Te,ye,Ne),v.setClearColor(W,z),Ie!==void 0&&(H.viewport=Ie),v.toneMapping=Ue}function Ws(T,N,k){const H=N.isScene===!0?N.overrideMaterial:null;for(let O=0,ae=T.length;O<ae;O++){const ge=T[O],Te=ge.object,ye=ge.geometry,Ne=ge.group;let Ue=ge.material;Ue.allowOverride===!0&&H!==null&&(Ue=H),Te.layers.test(k.layers)&&fl(Te,N,k,ye,Ue,Ne)}}function fl(T,N,k,H,O,ae){T.onBeforeRender(v,N,k,H,O,ae),T.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),O.onBeforeRender(v,N,k,H,T,ae),O.transparent===!0&&O.side===Et&&O.forceSinglePass===!1?(O.side=Gt,O.needsUpdate=!0,v.renderBufferDirect(k,N,H,O,T,ae),O.side=Fn,O.needsUpdate=!0,v.renderBufferDirect(k,N,H,O,T,ae),O.side=Et):v.renderBufferDirect(k,N,H,O,T,ae),T.onAfterRender(v,N,k,H,O,ae)}function Xs(T,N,k){N.isScene!==!0&&(N=we);const H=ie.get(T),O=m.state.lights,ae=m.state.shadowsArray,ge=O.state.version,Te=G.getParameters(T,O.state,ae,N,k),ye=G.getProgramCacheKey(Te);let Ne=H.programs;H.environment=T.isMeshStandardMaterial?N.environment:null,H.fog=N.fog,H.envMap=(T.isMeshStandardMaterial?ke:Ve).get(T.envMap||H.environment),H.envMapRotation=H.environment!==null&&T.envMap===null?N.environmentRotation:T.envMapRotation,Ne===void 0&&(T.addEventListener("dispose",j),Ne=new Map,H.programs=Ne);let Ue=Ne.get(ye);if(Ue!==void 0){if(H.currentProgram===Ue&&H.lightsStateVersion===ge)return ml(T,Te),Ue}else Te.uniforms=G.getUniforms(T),T.onBeforeCompile(Te,v),Ue=G.acquireProgram(Te,ye),Ne.set(ye,Ue),H.uniforms=Te.uniforms;const Ie=H.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ie.clippingPlanes=ce.uniform),ml(T,Te),H.needsLights=ad(T),H.lightsStateVersion=ge,H.needsLights&&(Ie.ambientLightColor.value=O.state.ambient,Ie.lightProbe.value=O.state.probe,Ie.directionalLights.value=O.state.directional,Ie.directionalLightShadows.value=O.state.directionalShadow,Ie.spotLights.value=O.state.spot,Ie.spotLightShadows.value=O.state.spotShadow,Ie.rectAreaLights.value=O.state.rectArea,Ie.ltc_1.value=O.state.rectAreaLTC1,Ie.ltc_2.value=O.state.rectAreaLTC2,Ie.pointLights.value=O.state.point,Ie.pointLightShadows.value=O.state.pointShadow,Ie.hemisphereLights.value=O.state.hemi,Ie.directionalShadowMap.value=O.state.directionalShadowMap,Ie.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ie.spotShadowMap.value=O.state.spotShadowMap,Ie.spotLightMatrix.value=O.state.spotLightMatrix,Ie.spotLightMap.value=O.state.spotLightMap,Ie.pointShadowMap.value=O.state.pointShadowMap,Ie.pointShadowMatrix.value=O.state.pointShadowMatrix),H.currentProgram=Ue,H.uniformsList=null,Ue}function pl(T){if(T.uniformsList===null){const N=T.currentProgram.getUniforms();T.uniformsList=Ir.seqWithValue(N.seq,T.uniforms)}return T.uniformsList}function ml(T,N){const k=ie.get(T);k.outputColorSpace=N.outputColorSpace,k.batching=N.batching,k.batchingColor=N.batchingColor,k.instancing=N.instancing,k.instancingColor=N.instancingColor,k.instancingMorph=N.instancingMorph,k.skinning=N.skinning,k.morphTargets=N.morphTargets,k.morphNormals=N.morphNormals,k.morphColors=N.morphColors,k.morphTargetsCount=N.morphTargetsCount,k.numClippingPlanes=N.numClippingPlanes,k.numIntersection=N.numClipIntersection,k.vertexAlphas=N.vertexAlphas,k.vertexTangents=N.vertexTangents,k.toneMapping=N.toneMapping}function sd(T,N,k,H,O){N.isScene!==!0&&(N=we),de.resetTextureUnits();const ae=N.fog,ge=H.isMeshStandardMaterial?N.environment:null,Te=C===null?v.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Ht,ye=(H.isMeshStandardMaterial?ke:Ve).get(H.envMap||ge),Ne=H.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Ue=!!k.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ie=!!k.morphAttributes.position,Je=!!k.morphAttributes.normal,ct=!!k.morphAttributes.color;let yt=$n;H.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(yt=v.toneMapping);const mt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,dt=mt!==void 0?mt.length:0,De=ie.get(H),_t=m.state.lights;if(Qe===!0&&(Y===!0||T!==y)){const Nt=T===y&&H.id===M;ce.setState(H,T,Nt)}let tt=!1;H.version===De.__version?(De.needsLights&&De.lightsStateVersion!==_t.state.version||De.outputColorSpace!==Te||O.isBatchedMesh&&De.batching===!1||!O.isBatchedMesh&&De.batching===!0||O.isBatchedMesh&&De.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&De.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&De.instancing===!1||!O.isInstancedMesh&&De.instancing===!0||O.isSkinnedMesh&&De.skinning===!1||!O.isSkinnedMesh&&De.skinning===!0||O.isInstancedMesh&&De.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&De.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&De.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&De.instancingMorph===!1&&O.morphTexture!==null||De.envMap!==ye||H.fog===!0&&De.fog!==ae||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==ce.numPlanes||De.numIntersection!==ce.numIntersection)||De.vertexAlphas!==Ne||De.vertexTangents!==Ue||De.morphTargets!==Ie||De.morphNormals!==Je||De.morphColors!==ct||De.toneMapping!==yt||De.morphTargetsCount!==dt)&&(tt=!0):(tt=!0,De.__version=H.version);let Wt=De.currentProgram;tt===!0&&(Wt=Xs(H,N,O));let mi=!1,Xt=!1,ss=!1;const vt=Wt.getUniforms(),Jt=De.uniforms;if(K.useProgram(Wt.program)&&(mi=!0,Xt=!0,ss=!0),H.id!==M&&(M=H.id,Xt=!0),mi||y!==T){K.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),vt.setValue(I,"projectionMatrix",T.projectionMatrix),vt.setValue(I,"viewMatrix",T.matrixWorldInverse);const zt=vt.map.cameraPosition;zt!==void 0&&zt.setValue(I,Me.setFromMatrixPosition(T.matrixWorld)),$.logarithmicDepthBuffer&&vt.setValue(I,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&vt.setValue(I,"isOrthographic",T.isOrthographicCamera===!0),y!==T&&(y=T,Xt=!0,ss=!0)}if(O.isSkinnedMesh){vt.setOptional(I,O,"bindMatrix"),vt.setOptional(I,O,"bindMatrixInverse");const Nt=O.skeleton;Nt&&(Nt.boneTexture===null&&Nt.computeBoneTexture(),vt.setValue(I,"boneTexture",Nt.boneTexture,de))}O.isBatchedMesh&&(vt.setOptional(I,O,"batchingTexture"),vt.setValue(I,"batchingTexture",O._matricesTexture,de),vt.setOptional(I,O,"batchingIdTexture"),vt.setValue(I,"batchingIdTexture",O._indirectTexture,de),vt.setOptional(I,O,"batchingColorTexture"),O._colorsTexture!==null&&vt.setValue(I,"batchingColorTexture",O._colorsTexture,de));const jt=k.morphAttributes;if((jt.position!==void 0||jt.normal!==void 0||jt.color!==void 0)&&se.update(O,k,Wt),(Xt||De.receiveShadow!==O.receiveShadow)&&(De.receiveShadow=O.receiveShadow,vt.setValue(I,"receiveShadow",O.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Jt.envMap.value=ye,Jt.flipEnvMap.value=ye.isCubeTexture&&ye.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&N.environment!==null&&(Jt.envMapIntensity.value=N.environmentIntensity),Xt&&(vt.setValue(I,"toneMappingExposure",v.toneMappingExposure),De.needsLights&&rd(Jt,ss),ae&&H.fog===!0&&Q.refreshFogUniforms(Jt,ae),Q.refreshMaterialUniforms(Jt,H,V,Z,m.state.transmissionRenderTarget[T.id]),Ir.upload(I,pl(De),Jt,de)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Ir.upload(I,pl(De),Jt,de),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&vt.setValue(I,"center",O.center),vt.setValue(I,"modelViewMatrix",O.modelViewMatrix),vt.setValue(I,"normalMatrix",O.normalMatrix),vt.setValue(I,"modelMatrix",O.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const Nt=H.uniformsGroups;for(let zt=0,Yr=Nt.length;zt<Yr;zt++){const ei=Nt[zt];We.update(ei,Wt),We.bind(ei,Wt)}}return Wt}function rd(T,N){T.ambientLightColor.needsUpdate=N,T.lightProbe.needsUpdate=N,T.directionalLights.needsUpdate=N,T.directionalLightShadows.needsUpdate=N,T.pointLights.needsUpdate=N,T.pointLightShadows.needsUpdate=N,T.spotLights.needsUpdate=N,T.spotLightShadows.needsUpdate=N,T.rectAreaLights.needsUpdate=N,T.hemisphereLights.needsUpdate=N}function ad(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(T,N,k){const H=ie.get(T);H.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),ie.get(T.texture).__webglTexture=N,ie.get(T.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:k,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,N){const k=ie.get(T);k.__webglFramebuffer=N,k.__useDefaultFramebuffer=N===void 0};const od=I.createFramebuffer();this.setRenderTarget=function(T,N=0,k=0){C=T,R=N,P=k;let H=!0,O=null,ae=!1,ge=!1;if(T){const ye=ie.get(T);if(ye.__useDefaultFramebuffer!==void 0)K.bindFramebuffer(I.FRAMEBUFFER,null),H=!1;else if(ye.__webglFramebuffer===void 0)de.setupRenderTarget(T);else if(ye.__hasExternalTextures)de.rebindTextures(T,ie.get(T.texture).__webglTexture,ie.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Ie=T.depthTexture;if(ye.__boundDepthTexture!==Ie){if(Ie!==null&&ie.has(Ie)&&(T.width!==Ie.image.width||T.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");de.setupDepthRenderbuffer(T)}}const Ne=T.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(ge=!0);const Ue=ie.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ue[N])?O=Ue[N][k]:O=Ue[N],ae=!0):T.samples>0&&de.useMultisampledRTT(T)===!1?O=ie.get(T).__webglMultisampledFramebuffer:Array.isArray(Ue)?O=Ue[k]:O=Ue,L.copy(T.viewport),U.copy(T.scissor),B=T.scissorTest}else L.copy(xe).multiplyScalar(V).floor(),U.copy(ze).multiplyScalar(V).floor(),B=Ze;if(k!==0&&(O=od),K.bindFramebuffer(I.FRAMEBUFFER,O)&&H&&K.drawBuffers(T,O),K.viewport(L),K.scissor(U),K.setScissorTest(B),ae){const ye=ie.get(T.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+N,ye.__webglTexture,k)}else if(ge){const ye=N;for(let Ne=0;Ne<T.textures.length;Ne++){const Ue=ie.get(T.textures[Ne]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Ne,Ue.__webglTexture,k,ye)}}else if(T!==null&&k!==0){const ye=ie.get(T.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,ye.__webglTexture,k)}M=-1},this.readRenderTargetPixels=function(T,N,k,H,O,ae,ge,Te=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=ie.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ge!==void 0&&(ye=ye[ge]),ye){K.bindFramebuffer(I.FRAMEBUFFER,ye);try{const Ne=T.textures[Te],Ue=Ne.format,Ie=Ne.type;if(!$.textureFormatReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$.textureTypeReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=T.width-H&&k>=0&&k<=T.height-O&&(T.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Te),I.readPixels(N,k,H,O,Pe.convert(Ue),Pe.convert(Ie),ae))}finally{const Ne=C!==null?ie.get(C).__webglFramebuffer:null;K.bindFramebuffer(I.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(T,N,k,H,O,ae,ge,Te=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=ie.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ge!==void 0&&(ye=ye[ge]),ye)if(N>=0&&N<=T.width-H&&k>=0&&k<=T.height-O){K.bindFramebuffer(I.FRAMEBUFFER,ye);const Ne=T.textures[Te],Ue=Ne.format,Ie=Ne.type;if(!$.textureFormatReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Je=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Je),I.bufferData(I.PIXEL_PACK_BUFFER,ae.byteLength,I.STREAM_READ),T.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Te),I.readPixels(N,k,H,O,Pe.convert(Ue),Pe.convert(Ie),0);const ct=C!==null?ie.get(C).__webglFramebuffer:null;K.bindFramebuffer(I.FRAMEBUFFER,ct);const yt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await gu(I,yt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Je),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ae),I.deleteBuffer(Je),I.deleteSync(yt),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,N=null,k=0){const H=Math.pow(2,-k),O=Math.floor(T.image.width*H),ae=Math.floor(T.image.height*H),ge=N!==null?N.x:0,Te=N!==null?N.y:0;de.setTexture2D(T,0),I.copyTexSubImage2D(I.TEXTURE_2D,k,0,0,ge,Te,O,ae),K.unbindTexture()};const ld=I.createFramebuffer(),cd=I.createFramebuffer();this.copyTextureToTexture=function(T,N,k=null,H=null,O=0,ae=null){ae===null&&(O!==0?(Ds("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ae=O,O=0):ae=0);let ge,Te,ye,Ne,Ue,Ie,Je,ct,yt;const mt=T.isCompressedTexture?T.mipmaps[ae]:T.image;if(k!==null)ge=k.max.x-k.min.x,Te=k.max.y-k.min.y,ye=k.isBox3?k.max.z-k.min.z:1,Ne=k.min.x,Ue=k.min.y,Ie=k.isBox3?k.min.z:0;else{const jt=Math.pow(2,-O);ge=Math.floor(mt.width*jt),Te=Math.floor(mt.height*jt),T.isDataArrayTexture?ye=mt.depth:T.isData3DTexture?ye=Math.floor(mt.depth*jt):ye=1,Ne=0,Ue=0,Ie=0}H!==null?(Je=H.x,ct=H.y,yt=H.z):(Je=0,ct=0,yt=0);const dt=Pe.convert(N.format),De=Pe.convert(N.type);let _t;N.isData3DTexture?(de.setTexture3D(N,0),_t=I.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(de.setTexture2DArray(N,0),_t=I.TEXTURE_2D_ARRAY):(de.setTexture2D(N,0),_t=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,N.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,N.unpackAlignment);const tt=I.getParameter(I.UNPACK_ROW_LENGTH),Wt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),mi=I.getParameter(I.UNPACK_SKIP_PIXELS),Xt=I.getParameter(I.UNPACK_SKIP_ROWS),ss=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,mt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,mt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ne),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ue),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ie);const vt=T.isDataArrayTexture||T.isData3DTexture,Jt=N.isDataArrayTexture||N.isData3DTexture;if(T.isDepthTexture){const jt=ie.get(T),Nt=ie.get(N),zt=ie.get(jt.__renderTarget),Yr=ie.get(Nt.__renderTarget);K.bindFramebuffer(I.READ_FRAMEBUFFER,zt.__webglFramebuffer),K.bindFramebuffer(I.DRAW_FRAMEBUFFER,Yr.__webglFramebuffer);for(let ei=0;ei<ye;ei++)vt&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ie.get(T).__webglTexture,O,Ie+ei),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ie.get(N).__webglTexture,ae,yt+ei)),I.blitFramebuffer(Ne,Ue,ge,Te,Je,ct,ge,Te,I.DEPTH_BUFFER_BIT,I.NEAREST);K.bindFramebuffer(I.READ_FRAMEBUFFER,null),K.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(O!==0||T.isRenderTargetTexture||ie.has(T)){const jt=ie.get(T),Nt=ie.get(N);K.bindFramebuffer(I.READ_FRAMEBUFFER,ld),K.bindFramebuffer(I.DRAW_FRAMEBUFFER,cd);for(let zt=0;zt<ye;zt++)vt?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,jt.__webglTexture,O,Ie+zt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,jt.__webglTexture,O),Jt?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Nt.__webglTexture,ae,yt+zt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Nt.__webglTexture,ae),O!==0?I.blitFramebuffer(Ne,Ue,ge,Te,Je,ct,ge,Te,I.COLOR_BUFFER_BIT,I.NEAREST):Jt?I.copyTexSubImage3D(_t,ae,Je,ct,yt+zt,Ne,Ue,ge,Te):I.copyTexSubImage2D(_t,ae,Je,ct,Ne,Ue,ge,Te);K.bindFramebuffer(I.READ_FRAMEBUFFER,null),K.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else Jt?T.isDataTexture||T.isData3DTexture?I.texSubImage3D(_t,ae,Je,ct,yt,ge,Te,ye,dt,De,mt.data):N.isCompressedArrayTexture?I.compressedTexSubImage3D(_t,ae,Je,ct,yt,ge,Te,ye,dt,mt.data):I.texSubImage3D(_t,ae,Je,ct,yt,ge,Te,ye,dt,De,mt):T.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,ae,Je,ct,ge,Te,dt,De,mt.data):T.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,ae,Je,ct,mt.width,mt.height,dt,mt.data):I.texSubImage2D(I.TEXTURE_2D,ae,Je,ct,ge,Te,dt,De,mt);I.pixelStorei(I.UNPACK_ROW_LENGTH,tt),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Wt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,mi),I.pixelStorei(I.UNPACK_SKIP_ROWS,Xt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,ss),ae===0&&N.generateMipmaps&&I.generateMipmap(_t),K.unbindTexture()},this.initRenderTarget=function(T){ie.get(T).__webglFramebuffer===void 0&&de.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?de.setTextureCube(T,0):T.isData3DTexture?de.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?de.setTexture2DArray(T,0):de.setTexture2D(T,0),K.unbindTexture()},this.resetState=function(){R=0,P=0,C=null,K.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}}class Z_{root=document.createElement("div");wheel;speed;rpm;gear;constructor(){this.root.className="cabin-interior",this.root.innerHTML=`<svg viewBox="0 0 1500 840" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="dashShade" x2="0" y2="1"><stop stop-color="#17191a"/><stop offset=".3" stop-color="#424344"/><stop offset="1" stop-color="#222526"/></linearGradient><linearGradient id="rimShade"><stop stop-color="#19191c"/><stop offset=".5" stop-color="#484448"/><stop offset="1" stop-color="#151619"/></linearGradient></defs>
        <path d="M0 0H1500V164L1120 168L1108 162L330 168L285 206L0 142Z" fill="#090b0c"/>
        <path d="M1110 158L1140 264Q1280 293 1500 246V100Z" fill="#101213"/>
        <path d="M0 179L285 180L493 555L367 526L0 340Z" fill="#111314"/>
        <path d="M285 201L328 166L518 547L487 559Z" fill="#292b2d"/>
        <path d="M306 199L328 166L518 547L500 550Z" fill="#373839" opacity=".5"/>
        <path d="M0 741L368 530L524 555L476 840H0Z" fill="#282d30"/>
        <path d="M0 795L359 613L391 674L350 840H0Z" fill="#11171a"/>
        <path d="M370 744L520 548Q745 509 965 535L1500 547V840H438Z" fill="url(#dashShade)"/>
        <path d="M514 550Q751 520 964 539L1500 551" fill="none" stroke="#858887" stroke-width="5"/>
        <path d="M1010 557L1458 565L1437 574L1001 566Z" fill="#101417"/>
        <path d="M523 666Q749 527 1020 645L1090 716L1500 711V817H430Z" fill="#363839"/>
        <path d="M1080 724H1490M1140 743H1440" stroke="#202426" stroke-width="3"/>
        <rect x="627" y="559" width="277" height="86" rx="7" fill="#03090e" stroke="#354450" stroke-width="3"/>
        <g fill="none" stroke="#52616d" stroke-width="4"><path d="M655 624A30 30 0 1 1 702 624"/><path d="M830 624A30 30 0 1 1 877 624"/></g>
        <g fill="#dbe7ed" font-family="Arial" font-size="9"><text x="667" y="580">RPM</text><text x="841" y="580">KM/H</text></g>
        <g id="interior-wheel" transform="rotate(0 760 785)"><circle cx="760" cy="785" r="282" fill="none" stroke="#0b0d0e" stroke-width="41"/><circle cx="760" cy="785" r="282" fill="none" stroke="url(#rimShade)" stroke-width="30"/>
        <path d="M493 737L705 759L717 805L512 792M1008 737L815 759L803 805L1000 798M726 811L704 1052H812L793 811" fill="#383a3e" stroke="#191c20" stroke-width="8"/>
        <ellipse cx="760" cy="790" rx="95" ry="67" fill="url(#dashShade)" stroke="#22272b" stroke-width="3"/></g>
        </svg><div class="interior-readout"><span class="interior-rpm">0</span><span class="interior-gear">N</span><span class="interior-speed">0</span></div>`,this.wheel=this.root.querySelector("#interior-wheel"),this.speed=this.root.querySelector(".interior-speed"),this.rpm=this.root.querySelector(".interior-rpm"),this.gear=this.root.querySelector(".interior-gear")}update(e){this.wheel.setAttribute("transform",`rotate(${e.steeringSystem.steeringWheelAngle} 760 785)`),this.speed.textContent=String(Math.round(e.getSpeedKmh())),this.rpm.textContent=String(e.transmission.rpm),this.gear.textContent=e.transmission.gear===0?"N":e.transmission.gear<0?"R":String(e.transmission.gear)}}class $_{interior=new Z_;views=[{camera:new wt(70,1.6,.05,500),eye:new E(-1.32,1.25,-.45),aim:new E(-1.45,.15,1.4),mirror:!0},{camera:new wt(70,1.6,.05,500),eye:new E(1.32,1.25,-.45),aim:new E(1.45,.15,1.4),mirror:!0},{camera:new wt(65,1.6,.05,500),eye:new E(-1.05,1.45,.1),aim:new E(-7,.25,.1),mirror:!1},{camera:new wt(65,1.6,.05,500),eye:new E(1.05,1.45,.1),aim:new E(7,.25,.1),mirror:!1}];overlay=document.createElement("div");frames=[];interiorClip="";mirrorTarget=new Jn(512,320);mirrorScene=new bh;mirrorCamera=new Gr(-1,1,1,-1,0,2);host;constructor(e){this.host=e;const t=new xt(2,2),n=t.getAttribute("uv");for(let s=0;s<n.count;s++)n.setX(s,1-n.getX(s));const i=new Se(t,new bt({map:this.mirrorTarget.texture,depthTest:!1,depthWrite:!1,toneMapped:!1}));i.position.z=-1,this.mirrorScene.add(i),this.overlay.className="cabin-overlay",this.overlay.hidden=!0,this.overlay.innerHTML='<div class="cabin-roof"></div><div class="cabin-pillar"></div><div class="cabin-dashboard"></div><div class="mirror-frame mirror-left"><b>GƯƠNG TRÁI</b></div><div class="mirror-frame mirror-right"><b>GƯƠNG PHẢI</b></div><div class="mirror-frame shoulder-view"><b>CANH VAI · GHẾ LÁI</b></div><div class="mirror-frame passenger-view"><b>CỬA SỔ PHẢI · GHẾ PHỤ</b></div>',e.appendChild(this.overlay),this.overlay.querySelectorAll(".cabin-roof,.cabin-pillar,.cabin-dashboard").forEach(s=>s.remove()),this.overlay.prepend(this.interior.root),this.frames=Array.from(this.overlay.querySelectorAll(".mirror-frame"))}render(e,t,n,i,s){this.overlay.hidden=!s,s&&this.interior.update(i);const a=this.host.clientWidth,o=this.host.clientHeight;if(e.setViewport(0,0,a,o),!s){e.render(t,n);return}const l=i.root.visible;i.root.visible=!1,e.render(t,n),i.root.visible=l,i.root.updateWorldMatrix(!0,!0);const c=i.root.children.find(_=>_.type==="Group")??i.root,h=this.host.getBoundingClientRect(),d=this.frames.map(_=>_.getBoundingClientRect()),f=this.overlay.getBoundingClientRect();let u=`M0 0H${f.width}V${f.height}H0Z`;for(const _ of d){const p=_.left-f.left,m=_.top-f.top;u+=`M${p} ${m}h${_.width}v${_.height}h${-_.width}Z`}u!==this.interiorClip&&(this.interiorClip=u,this.interior.root.style.clipPath=`path(evenodd, "${u}")`);const g=e.autoClear;e.autoClear=!1,e.setScissorTest(!0);for(let _=0;_<this.views.length;_++){const p=this.views[_],m=d[_];p.camera.position.copy(c.localToWorld(p.eye.clone())),p.camera.up.set(0,1,0).applyQuaternion(c.getWorldQuaternion(new Bn)),p.camera.lookAt(c.localToWorld(p.aim.clone())),p.camera.aspect=m.width/m.height,p.camera.updateProjectionMatrix(),p.mirror&&(e.setScissorTest(!1),e.setRenderTarget(this.mirrorTarget),e.clear(!0,!0,!0),e.render(t,p.camera),e.setRenderTarget(null),e.setScissorTest(!0));const w=m.left-h.left,S=o-(m.bottom-h.top);e.setViewport(w,S,m.width,m.height),e.setScissor(w,S,m.width,m.height),e.clear(!0,!0,!0),e.render(p.mirror?this.mirrorScene:t,p.mirror?this.mirrorCamera:p.camera)}e.setScissorTest(!1),e.setViewport(0,0,a,o),e.autoClear=g}}class J_{analog=new Map;getAnalog(e){return this.analog.get(e)}setAnalog(e,t){this.analog.set(e,Math.max(0,Math.min(1,t)))}keys=new Set;virtual=new Set;constructor(){window.addEventListener("blur",()=>{this.keys.clear(),this.virtual.clear(),this.analog.clear()}),window.addEventListener("keydown",e=>{["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space","Enter","ShiftLeft","ShiftRight"].includes(e.code)&&e.preventDefault(),this.keys.add(e.code)},{passive:!1}),window.addEventListener("keyup",e=>this.keys.delete(e.code))}isDown(e){return this.keys.has(e)||this.virtual.has(e)}setVirtual(e,t){t?this.virtual.add(e):this.virtual.delete(e)}clearVirtual(){this.virtual.clear(),this.analog.clear()}}const j_={biteStart:.5,biteOptimal:.3,biteFull:.2,optimalEngagement:.35,pressRate:.5,releaseRate:.26,fastReleaseRate:2,idleRPM:800,stallRPM:500,stallDelay:.25,inertia:.28,clutchCapacity:240,slipGain:.3,rideDelay:3,rideSlipRPM:350,mass:1200,wheelRadius:.36,finalDrive:4.1,efficiency:.9,ratios:[0,3.5,2,1.3,1,.8],reverseRatio:-3.4,redlineRPM:5500,torqueFadeRPM:4200,peakTorque:160,lugRPM:1200},Vc={1:{min:0,max:20,recommendedMin:0,recommendedMax:15},2:{min:10,max:40,recommendedMin:15,recommendedMax:30},3:{min:25,max:60,recommendedMin:30,recommendedMax:45},4:{min:40,max:80,recommendedMin:45,recommendedMax:65},5:{min:60,max:140,recommendedMin:60,recommendedMax:120}},_n=(r,e,t)=>Math.max(e,Math.min(t,r));class Q_{constructor(e){this.c=e}c;running=!1;rpm=0;lowTime=0;start(){this.running=!0,this.rpm=this.c.idleRPM,this.lowTime=0}stop(){this.running=!1,this.rpm=0,this.lowTime=0}update(e,t,n){if(!this.running)return;const i=_n((this.c.idleRPM-this.rpm)*.4,0,65),s=_n(this.rpm/this.c.lugRPM,.15,1),a=_n((this.c.redlineRPM-this.rpm)/(this.c.redlineRPM-this.c.torqueFadeRPM),0,1),o=i+t*this.c.peakTorque*s*a-this.rpm*.004;this.rpm=_n(this.rpm+(o-n)/this.c.inertia*60/(2*Math.PI)*e,0,this.c.redlineRPM)}checkStall(e,t,n){return this.lowTime=this.running&&this.rpm<this.c.stallRPM&&t>.65&&n!==0?this.lowTime+e:0,this.lowTime>=this.c.stallDelay?(this.stop(),!0):!1}}class ev{constructor(e){this.c=e}c;pedal=0;engagement=1;releaseSpeed=0;slipRPM=0;riding=!1;rideTime=0;update(e,t,n){const i=t>this.pedal?this.c.pressRate:n?this.c.fastReleaseRate:this.c.releaseRate;this.pedal+=_n(t-this.pedal,-i*e,i*e);const s=this.engagement;this.engagement=this.pedal>=this.c.biteOptimal?this.c.optimalEngagement*_n((this.c.biteStart-this.pedal)/(this.c.biteStart-this.c.biteOptimal),0,1):this.c.optimalEngagement+(1-this.c.optimalEngagement)*_n((this.c.biteOptimal-this.pedal)/(this.c.biteOptimal-this.c.biteFull),0,1),this.releaseSpeed=(this.engagement-s)/e}torque(e,t,n,i){this.slipRPM=t-n;const s=i&&this.engagement>.05&&this.engagement<.95&&Math.abs(this.slipRPM)>this.c.rideSlipRPM;return this.rideTime=s?this.rideTime+e:0,this.riding=this.rideTime>=this.c.rideDelay,i?_n(this.slipRPM*this.c.slipGain,-this.c.clutchCapacity*this.engagement,this.c.clutchCapacity*this.engagement):0}}class tv{constructor(e){this.c=e}c;gear=0;get ratio(){return(this.gear<0?this.c.reverseRatio:this.c.ratios[this.gear])*this.c.finalDrive}rpm(e){return e/this.c.wheelRadius*this.ratio*60/(2*Math.PI)}force(e){return e*this.ratio*this.c.efficiency/this.c.wheelRadius}}class nv{constructor(e){this.c=e}c;speed=0;acceleration=0;update(e,t,n,i){const s=this.speed,a=this.speed+(t/this.c.mass-9.81*Math.sin(i))*e,o=(.16+.006*a*a+n*12)*e;this.speed=Math.sign(a)*Math.max(0,Math.abs(a)-o),this.acceleration=(this.speed-s)/e}}function iv(r,e){if(!(r in Vc))return[];const t=Vc[r],n=[];return e>t.max&&n.push("LOW_GEAR_HIGH_SPEED"),e<t.min&&n.push("HIGH_GEAR_LOW_SPEED"),r<5&&e>=t.recommendedMax&&n.push("RECOMMEND_SHIFT_UP"),r>1&&e<t.recommendedMin&&n.push("RECOMMEND_SHIFT_DOWN"),n}class Gc{constructor(e=j_){this.config=e,this.engine=new Q_(e),this.clutch=new ev(e),this.gearbox=new tv(e),this.physics=new nv(e)}config;engine;clutch;gearbox;physics;jolt=0;joltVelocity=0;stalled=!1;warnings=[];vibration=0;phase=0;update(e,t,n,i,s,a){this.stalled=!1;for(let o=Math.min(e,.1);o>1e-8;){const l=Math.min(o,.004166666666666667);o-=l,this.clutch.update(l,n,i);const c=this.clutch.torque(l,this.engine.rpm,this.gearbox.rpm(this.physics.speed),this.engine.running&&this.gearbox.gear!==0);this.engine.update(l,t,c),this.physics.update(l,this.gearbox.force(c),s,a),this.engine.checkStall(l,this.clutch.engagement,this.gearbox.gear)&&(this.stalled=!0);const h=this.clutch.releaseSpeed>6&&Math.abs(this.physics.speed)<2?c*.015:0;this.joltVelocity+=(h-65*this.jolt-10*this.joltVelocity)*l,this.jolt+=this.joltVelocity*l;const d=this.engine.running&&this.gearbox.gear!==0?Math.max(0,1-this.engine.rpm/this.config.lugRPM)*this.clutch.engagement*t:0;this.phase=(this.phase+this.engine.rpm/60*2*Math.PI*l)%(2*Math.PI),this.vibration=Math.sin(this.phase)*d*.015}this.warnings=this.engine.running&&this.clutch.engagement>.65?iv(this.gearbox.gear,Math.abs(this.physics.speed)*3.6):[]}}const wr={gasPressRate:.5,gasReleaseRate:2,brakePressRate:1.5,brakeReleaseRate:3};class Wc{gas=0;brake=0;update(e,t,n){const i=(s,a,o,l)=>s+_n(_n(a,0,1)-s,-l*Math.max(0,e),o*Math.max(0,e));this.gas=i(this.gas,t,wr.gasPressRate,wr.gasReleaseRate),this.brake=i(this.brake,n,wr.brakePressRate,wr.brakeReleaseRate)}}class sv{car=new Gc;pedals=new Wc;get running(){return this.car.engine.running}get gear(){return this.car.gearbox.gear}set gear(e){this.car.gearbox.gear=e}get clutch(){return this.car.clutch.pedal}get rpm(){return Math.round(this.car.engine.rpm)}status="Máy tắt";held=new Set;reset(){this.car=new Gc,this.status="Máy tắt",this.pedals=new Wc}update(e,t,n,i=0){const s=c=>{const h=t.isDown(c),d=h&&!this.held.has(c);return h?this.held.add(c):this.held.delete(c),d},a=t.isDown("ShiftLeft")||t.isDown("ShiftRight");s("Enter")&&(this.running?(this.car.engine.stop(),this.status="Máy tắt"):this.gear===0&&this.clutch>=1-1e-6?(this.car.engine.start(),this.status="Máy đang chạy"):this.status="Về số N và đạp hết côn (thanh 0%), rồi nhấn Enter");for(const[c,h]of[["KeyN",0],["KeyR",-1],["Digit1",1],["Digit2",2],["Digit3",3],["Digit4",4],["Digit5",5]])if(s(c)){if(this.car.clutch.engagement>.001){this.status="Đạp côn xuống mức 50% hoặc thấp hơn để sang số";continue}if(h===-1&&n>.1||h>0&&n<-.1){this.status="Dừng xe trước khi đổi chiều";continue}this.gear=h,this.status=this.running?"Máy đang chạy":"Máy tắt"}const o=t.isDown("KeyW")||t.isDown("ArrowUp"),l=t.isDown("KeyS")||t.isDown("ArrowDown")||t.isDown("Space");return this.pedals.update(e,o?1:t.getAnalog("gas")??0,l?1:0),this.car.physics.speed=n,this.car.update(e,this.pedals.gas,a?1:t.getAnalog("clutch")??0,t.isDown("KeyF"),this.pedals.brake,i),this.car.stalled?this.status="Chết máy — về N, đạp hết côn rồi nhấn Enter":this.car.clutch.riding?this.status="Đang rà côn":this.status==="Đang rà côn"&&(this.status=this.running?"Máy đang chạy":"Máy tắt"),this.car.physics.speed}}const Lt={lineX:-35,lineZ:-2,distance:15,laneOffset:-2,heading:-Math.PI/2},Ft={maxSteeringWheelAngle:540,maxRoadWheelAngle:34,steeringSpeed:750,steeringReturnStrength:.8,wheelBase:2.55,trackWidth:1.88,wheelRadius:.36},rv=Math.PI/180,Xc=(r,e)=>Math.max(-e,Math.min(e,r));class av{steeringWheelAngle=0;centerSteerAngle=0;frontLeftAngle=0;frontRightAngle=0;reset(){this.steeringWheelAngle=0,this.calculateAckermann()}update(e,t,n,i){t?this.steeringWheelAngle+=t*Ft.steeringSpeed*e:i!==void 0?this.steeringWheelAngle+=Xc(i-this.steeringWheelAngle,Ft.steeringSpeed*e):this.steeringWheelAngle*=Math.exp(-Math.abs(n)*Ft.steeringReturnStrength*e),this.steeringWheelAngle=Xc(this.steeringWheelAngle,Ft.maxSteeringWheelAngle),this.calculateAckermann()}calculateAckermann(){if(this.centerSteerAngle=this.steeringWheelAngle/Ft.maxSteeringWheelAngle*Ft.maxRoadWheelAngle*rv,Math.abs(this.centerSteerAngle)<1e-8){this.frontLeftAngle=this.frontRightAngle=0;return}const e=Ft.wheelBase/Math.tan(Math.abs(this.centerSteerAngle)),t=Math.atan(Ft.wheelBase/(e-Ft.trackWidth/2)),n=Math.atan(Ft.wheelBase/(e+Ft.trackWidth/2));this.frontLeftAngle=this.centerSteerAngle<0?-t:n,this.frontRightAngle=this.centerSteerAngle<0?-n:t}}function Qh(r,e,t,n,i,s){const a=-n/Ft.wheelBase*Math.tan(i),o=t+a*s;return Math.abs(a)<1e-8?{x:r-Math.sin(t)*n*s,z:e-Math.cos(t)*n*s,heading:o}:{x:r+n/a*(Math.cos(o)-Math.cos(t)),z:e-n/a*(Math.sin(o)-Math.sin(t)),heading:o}}class ll{steeringSystem=new av;transmission=new sv;root=new et;visual=new et;wheels=[];frontPivots=[];speed=0;steering=0;seatBeltFastened=!1;signalState={left:!1,right:!1,hazard:!1};get signals(){return this.signalState}signalMaterials={turn:[],hazard:[]};maxForward=24/3.6;maxReverse=-5;acceleration=7;braking=12;drag=2.1;slopeAngle=0;gravity=9.81;slopeRollingResistance=.2;wheelBase=2.65;maxSteer=Dn.degToRad(31);constructor(){this.build(),this.root.children.length&&this.visual.add(...this.root.children),this.root.add(this.visual),this.placeAtStart()}build(){const e=new ve({color:16053749,roughness:.28,metalness:.22}),t=new ve({color:599608,roughness:.16,metalness:.35}),n=new ve({color:1382169,roughness:.9}),i=new ve({color:1054752,roughness:.4}),s=new ve({color:12240332,roughness:.24,metalness:.8}),a=new ve({color:15136255,emissive:10405085,emissiveIntensity:.35}),o=new bt({color:6965768,toneMapped:!0});new bt({color:16765514,toneMapped:!1});const l=new bt({color:6950928,toneMapped:!0});new bt({color:16732240,toneMapped:!1});const c=new ve({color:10881305,roughness:.25}),h=(C,M,y,L,U,B=this.root)=>{const W=new Se(C,M);return W.position.set(y,L,U),W.castShadow=!0,W.receiveShadow=!0,B.add(W),W},d=(C,M,y,L,U,B,W)=>h(new rt(C,M,y),L,U,B,W),f=(C,M)=>{const y=new Tt;y.setAttribute("position",new ut(C.flat(),3)),y.setIndex([0,1,2,0,2,3]),y.computeVertexNormals();const L=M.clone();return L.side=Et,h(y,L,0,0,0)},u=(C,M,y,L,U,B,W,z="#ffffff",X="#103979",Z=!1)=>{const V=document.createElement("canvas");V.width=512,V.height=256;const ne=V.getContext("2d");ne.fillStyle=z,ne.fillRect(0,0,512,256),ne.fillStyle=X,ne.strokeStyle=X,ne.textAlign="center",ne.textBaseline="middle",ne.font=`bold ${Z?176:70}px Arial`,Z&&(ne.lineWidth=10,ne.beginPath(),ne.ellipse(256,128,112,119,0,0,Math.PI*2),ne.stroke());const pe=C.split(`
`);pe.forEach((Ze,nt)=>ne.fillText(Ze,256,128+(nt-(pe.length-1)/2)*85,480));const xe=new Kt(V);xe.colorSpace=lt;const ze=h(new xt(M,y),new ve({map:xe,roughness:.55}),L,U,B);ze.rotation.y=W},g=new Qi;g.moveTo(-2.12,.4),g.lineTo(-2.15,.73),g.quadraticCurveTo(-2.06,.96,-1.8,1),g.lineTo(-.85,1.08),g.lineTo(.95,1.08),g.lineTo(1.85,.98),g.quadraticCurveTo(2.13,.91,2.13,.65),g.lineTo(2.08,.4),g.lineTo(1.73,.4),g.absarc(1.25,.4,.48,0,Math.PI,!1),g.lineTo(-.82,.4),g.absarc(-1.3,.4,.48,0,Math.PI,!1),g.lineTo(-2.12,.4);const _=new pi(g,{depth:1.74,bevelEnabled:!0,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:20});_.translate(0,0,-.87),_.rotateY(-Math.PI/2),h(_,e,0,0,0),f([[-.84,1.08,-.85],[.84,1.08,-.85],[.67,1.62,-.22],[-.67,1.62,-.22]],t),f([[-.67,1.62,.72],[.67,1.62,.72],[.83,1.08,1.38],[-.83,1.08,1.38]],t),d(1.38,.07,.98,e,0,1.64,.25);for(const C of[-1,1])f([[C*.85,1.07,-.84],[C*.68,1.61,-.21],[C*.68,1.61,.72],[C*.85,1.07,1.37]],e),f([[C*.855,1.12,-.68],[C*.705,1.56,-.18],[C*.705,1.56,.28],[C*.855,1.12,.28]],t),f([[C*.855,1.12,.36],[C*.705,1.56,.36],[C*.705,1.56,.68],[C*.855,1.12,1.2]],t),d(.055,.04,1.94,s,C*.887,1.065,.28),d(.07,.055,.2,e,C*.91,.94,.16),d(.07,.055,.2,e,C*.91,.94,.99),d(.16,.065,.11,i,C*.94,1.11,-.65),h(new Nn(1,16,10),e,C*1.04,1.16,-.65).scale.set(.17,.09,.12),d(.035,.065,1.5,i,C*.9,.43,-.02),u("TẬP LÁI",.44,.14,C*.908,1,-.44,C*Math.PI/2,"#123a88","#ffffff"),u(`HIỆP PHÁT
ĐÀO TẠO LÁI XE`,.66,.26,C*.908,.73,-.3,C*Math.PI/2),u("29",.52,.43,C*.908,.78,.69,C*Math.PI/2,"#f4f5f5","#ae1020",!0);d(1.3,.31,.055,i,0,.6,-2.15);for(let C=0;C<4;C++)d(1.24-C*.06,.018,.015,s,0,.48+C*.075,-2.185);d(1.25,.085,.05,i,0,.91,-2.12);for(const C of[-1,1]){const M=d(.47,.12,.11,a,C*.63,.92,-2.04);M.rotation.y=C*.18,d(.2,.19,.05,i,C*.73,.57,-2.12);const y=h(new Nn(.06,12,8),a,C*.73,.56,-2.155);y.scale.z=.3,d(.43,.15,.09,c,C*.65,.87,2.09)}const p=new ve({color:395532,roughness:.5,metalness:.3}),m=C=>C+Math.sign(C)*.026,w=(C,M,y)=>(h(new rt(.3,.16,.05),p,C,M,y),d(.24,.11,.035,o.clone(),C,M,m(y)).material),S=C=>{h(new rt(.85,.075,.045),p,0,.95,C);const M=[];for(let y=-2;y<=2;y++){const L=d(.13,.055,.03,l.clone(),y*.155,.95,m(C));M.push(L.material)}return M},v=[],A=[];v.push(w(-.86,.92,-2.16)),v.push(w(-.86,.92,2.16)),v.push(w(.86,.92,-2.16)),v.push(w(.86,.92,2.16)),A.push(...S(-2.185)),A.push(...S(2.185)),this.signalMaterials={turn:v,hazard:A};const R=h(new Bs(.07,.012,8,24),s,0,.91,-2.16);R.scale.x=1.35,u(`51K
147.14`,.3,.23,0,.65,-2.19,Math.PI,"#ffffff","#101820"),u("51K - 147.14",.48,.12,0,.66,2.145,0,"#ffffff","#101820");for(const C of[-.48,.48])d(.09,.11,.27,i,C,1.72,.25);d(1.24,.22,.31,e,0,1.85,.25),u("HIỆP PHÁT",1.1,.17,0,1.85,.089,Math.PI,"#8ec5e5"),u("TẬP LÁI",1.1,.17,0,1.85,.411,0,"#8ec5e5");for(const C of[-.44,0,.44]){h(new Vt(.08,.09,.03,16),s,C,1.98,.25);const M=h(new Nn(.085,16,12),C===0?new ve({color:16756232,roughness:.25}):c,C,2.045,.25);M.scale.y=1.2}const P=new Vt(.36,.36,.22,32);P.rotateZ(Math.PI/2);for(const C of[-.94,.94])for(const M of[-1.3,1.25]){const y=new et;y.position.set(C,.36,M);const L=h(P,n,0,0,0,y),U=new Vt(.255,.255,.012,24);U.rotateZ(Math.PI/2),h(U,i,Math.sign(C)*.117,0,0,L);const B=h(new Bs(.245,.022,8,32),s,Math.sign(C)*.126,0,0,L);B.rotation.y=Math.PI/2;for(let z=0;z<8;z++){const X=z*Math.PI/4,Z=h(new rt(.018,.035,.41),s,Math.sign(C)*.13,0,0,L);Z.rotation.x=X}const W=new Vt(.07,.07,.025,16);W.rotateZ(Math.PI/2),h(W,s,Math.sign(C)*.14,0,0,L),this.root.add(y),this.wheels.push(L),M<0&&this.frontPivots.push(y)}}followSurface(e){const t=(o,l)=>{const c=new E(o,0,l).applyQuaternion(this.root.quaternion).add(this.root.position);return e(c.x,c.z)},n=t(0,-1.3),i=t(0,1.25),s=t(-.94,0),a=t(.94,0);this.slopeAngle=Math.atan2(n-i,2.55),this.root.position.y=(n+i)/2,this.visual.rotation.set(this.slopeAngle+this.transmission.car.jolt*.12+this.transmission.car.vibration,0,Math.atan2(a-s,1.88))}reset(){this.transmission.reset(),this.steeringSystem.reset(),this.placeAtStart(),this.visual.rotation.set(0,0,0),this.slopeAngle=0,this.speed=0,this.steering=0,this.seatBeltFastened=!1,this.signalState={left:!1,right:!1,hazard:!1};for(const e of this.signalMaterials.turn)e.color.setHex(6965768);for(const e of this.signalMaterials.hazard)e.color.setHex(6950928)}placeAtStart(){this.root.position.set(Lt.lineX-Lt.distance,0,Lt.lineZ+Lt.laneOffset),this.root.rotation.set(0,Lt.heading,0)}setSignal(e){this.signalState={...e}}updateSignalBlink(){const t=performance.now()%1100<550,n=t?16765514:6965768,i=t?16732240:6950928;this.signals.left?(this.signalMaterials.turn[0].color.setHex(n),this.signalMaterials.turn[1].color.setHex(n)):(this.signalMaterials.turn[0].color.setHex(6965768),this.signalMaterials.turn[1].color.setHex(6965768)),this.signals.right?(this.signalMaterials.turn[2].color.setHex(n),this.signalMaterials.turn[3].color.setHex(n)):(this.signalMaterials.turn[2].color.setHex(6965768),this.signalMaterials.turn[3].color.setHex(6965768));const s=this.signals.hazard?i:6950928;for(const a of this.signalMaterials.hazard)a.color.setHex(s)}update(e,t){const n=t.isDown("KeyA")||t.isDown("ArrowLeft"),i=t.isDown("KeyD")||t.isDown("ArrowRight"),s=t.getAnalog("steeringActive")===1;this.steeringSystem.update(e,Number(i)-Number(n),this.speed,s?((t.getAnalog("steering")??.5)*2-1)*Ft.maxSteeringWheelAngle:void 0),this.steering=this.steeringSystem.centerSteerAngle,this.speed=this.transmission.update(e,t,this.speed,this.slopeAngle);const a=Qh(this.root.position.x,this.root.position.z,this.root.rotation.y,this.speed,this.steering,e);this.root.position.x=a.x,this.root.position.z=a.z,this.root.rotation.y=a.heading;for(const o of this.frontPivots)o.rotation.y=-(o.position.x<0?this.steeringSystem.frontLeftAngle:this.steeringSystem.frontRightAngle);for(const o of this.wheels)o.rotation.x-=this.speed/Ft.wheelRadius*e;this.updateSignalBlink()}getSpeedKmh(){return Math.abs(this.speed)*3.6}}class ov extends ll{build(){this.root.name="vehicle2-exam-sedan";const e=new ve({color:15987953,metalness:.35,roughness:.23}),t=new ve({color:2372664,metalness:.45,roughness:.14}),n=new ve({color:1251097,roughness:.7}),i=new ve({color:12371403,metalness:.85,roughness:.22}),s=new ve({color:15003647,emissive:8494261,emissiveIntensity:.4}),a=new ve({color:11407643,emissive:6882576,emissiveIntensity:.3}),o=(_,p,m,w,S,v,A=this.root)=>{const R=new Se(p,m);return R.name=_,R.position.set(w,S,v),R.castShadow=!0,R.receiveShadow=!0,A.add(R),R},l=(_,p,m,w,S,v,A,R=e,P=this.root)=>o(_,new rt(p,m,w),R,S,v,A,P),c=(_,p,m)=>{const w=new Tt;w.setAttribute("position",new ut(p.flat(),3)),w.setIndex([0,1,2,0,2,3]),w.computeVertexNormals();const S=m.clone();return S.side=Et,o(_,w,S,0,0,0)},h=(_,p,m,w,S,v,A,R=0,P=!1)=>{const C=document.createElement("canvas");C.width=512,C.height=256;const M=C.getContext("2d");M.clearRect(0,0,512,256),M.fillStyle=P?"#1244bc":"#f4f5f2",P?(M.beginPath(),M.ellipse(256,128,124,124,0,0,Math.PI*2),M.fill()):M.fillRect(0,0,512,256),M.fillStyle=P?"#fff":_.includes("Plate")?"#111":"#123aa1",M.textAlign="center",M.textBaseline="middle",M.font=`bold ${P?170:70}px Arial`,M.fillText(p,256,135,490);const y=new Kt(C);y.colorSpace=lt;const L=o(_,new xt(m,w),new ve({map:y,transparent:P,roughness:.5}),S,v,A);return L.rotation.y=R,L},d=new Qi;d.moveTo(-2.2,.42),d.lineTo(-2.2,.69),d.quadraticCurveTo(-2.12,.91,-1.75,.96),d.lineTo(-.85,1.02),d.lineTo(.95,1.01),d.lineTo(1.8,.97),d.quadraticCurveTo(2.21,.94,2.21,.68),d.lineTo(2.21,.42),d.lineTo(1.68,.42),d.absarc(1.25,.42,.43,0,Math.PI,!1),d.lineTo(-.87,.42),d.absarc(-1.3,.42,.43,0,Math.PI,!1),d.lineTo(-2.2,.42);const f=new pi(d,{depth:1.74,bevelEnabled:!0,bevelSize:.02,bevelThickness:.02,bevelSegments:3,curveSegments:24,steps:1});f.translate(0,0,-.87),f.rotateY(-Math.PI/2),o("SedanBody",f,e,0,0,0),c("Windshield",[[-.83,1.02,-.86],[.83,1.02,-.86],[.65,1.45,-.25],[-.65,1.45,-.25]],t),c("RearWindow",[[-.65,1.45,.61],[.65,1.45,.61],[.81,1.01,1.35],[-.81,1.01,1.35]],t),l("Roof",1.32,.05,.91,0,1.45,.18);for(const _ of[-1,1]){c("CabinFrame",[[_*.84,1,-.85],[_*.66,1.45,-.25],[_*.66,1.45,.62],[_*.84,1,1.36]],e),c("FrontSideGlass",[[_*.849,1.04,-.74],[_*.679,1.41,-.23],[_*.679,1.41,.17],[_*.849,1.04,.17]],t),c("RearSideGlass",[[_*.849,1.04,.24],[_*.679,1.41,.24],[_*.679,1.41,.59],[_*.849,1.04,1.19]],t),l("WindowTrim",.022,.022,1.85,_*.88,1.025,.14,i);for(const w of[.05,.93])l("DoorHandle",.045,.036,.18,_*.903,.92,w);for(const w of[.23,1.22])l("DoorSeam",.008,.43,.008,_*.894,.72,w,n);l("Sill",.03,.055,1.6,_*.89,.43,.03),o("WingMirror",new Nn(1,16,10),e,_*1.04,1.09,-.62).scale.set(.16,.085,.12),l("MirrorMount",.13,.04,.08,_*.92,1.06,-.62,n),h("DoorNumber","01",.66,.44,_*.901,.73,-.25,_*Math.PI/2,!0);const m=l("Headlight",.48,.14,.08,_*.59,.88,-2.08,s);m.rotation.y=_*.18,o("Projector",new Nn(.057,16,10),i,_*.62,.89,-2.137).scale.z=.35,l("FogRecess",.19,.17,.035,_*.72,.52,-2.2,n),o("FogLamp",new Nn(.045,12,8),s,_*.72,.52,-2.225).scale.z=.3,l("TailLight",.44,.17,.065,_*.63,.87,2.16,a),l("RearReflector",.22,.04,.025,_*.68,.46,2.22,a)}l("UpperGrille",.95,.08,.04,0,.9,-2.18,n),l("GrilleChrome",1.1,.017,.03,0,.945,-2.19,i),l("LowerGrille",1.22,.26,.045,0,.55,-2.205,n);for(let _=0;_<5;_++)l("GrilleSlat",1.13,.012,.01,0,.45+_*.044,-2.235,i);h("FrontPlate","HIỆP PHÁT",.49,.16,0,.64,-2.24,Math.PI),h("RearPlate","HIỆP PHÁT",.49,.16,0,.73,2.225);const u=h("HoodNumber","01",.65,.43,0,1.007,-1.4,0,!0);u.rotation.x=-Math.PI/2,l("RoofSign",.95,.19,.25,0,1.585,.15),h("RoofTitleFront","XE SÁT HẠCH",.92,.17,0,1.585,.018,Math.PI),h("RoofTitleRear","XE SÁT HẠCH",.92,.17,0,1.585,.282);for(const[_,p]of[16063527,16761355,1463807].entries()){l("BeaconBase",.17,.025,.17,(_-1)*.27,1.7,.15,n);const m=o("RoofBeacon",new Nn(.077,16,12),new ve({color:p,emissive:p,emissiveIntensity:.5,roughness:.2}),(_-1)*.27,1.77,.15);m.scale.y=1.1}for(const _ of[-.94,.94])for(const p of[-1.3,1.25]){const m=new et;m.name=p<0?"FrontSteeringPivot":"RearWheelPivot",m.position.set(_,.36,p),this.root.add(m);const w=new Vt(.36,.36,.22,32);w.rotateZ(Math.PI/2);const S=o("Tire",w,n,0,0,0,m);this.wheels.push(S),p<0&&this.frontPivots.push(m);const v=new Vt(.25,.25,.025,24);v.rotateZ(Math.PI/2),o("AlloyRim",v,i,Math.sign(_)*.12,0,0,S);for(let A=0;A<10;A++){const R=A*Math.PI/5,P=l("AlloySpoke",.025,.025,.22,Math.sign(_)*.14,Math.sin(R)*.115,Math.cos(R)*.115,i,S);P.rotation.x=-R}}const g=[];for(const _ of[-1,1])for(const p of[-2.21,2.21]){const m=new ve({color:6965768});l("TurnSignal",.14,.065,.025,_*.79,.83,p,m),g.push(m)}this.signalMaterials={turn:g,hazard:[]}}updateSignalBlink(){const e=performance.now()%1100<550;this.signalMaterials.turn.forEach((t,n)=>{const i=this.signals.hazard||(n<2?this.signals.left:this.signals.right);t.color.setHex(i&&e?16765514:6965768),t.emissive.setHex(i&&e?16752640:0)})}reset(){super.reset(),this.signalMaterials.turn.forEach(e=>e.emissive.setHex(0))}}function qc(r,e){if(e===Vd)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===bo||e===mh){let t=r.getIndex();if(t===null){const a=[],o=r.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);r.setIndex(a),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}const n=t.count-2,i=[];if(e===bo)for(let a=1;a<=n;a++)i.push(t.getX(0)),i.push(t.getX(a)),i.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(i.push(t.getX(a)),i.push(t.getX(a+1)),i.push(t.getX(a+2))):(i.push(t.getX(a+2)),i.push(t.getX(a+1)),i.push(t.getX(a)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const s=r.clone();return s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}class ed extends ns{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new uv(t)}),this.register(function(t){return new fv(t)}),this.register(function(t){return new Mv(t)}),this.register(function(t){return new Ev(t)}),this.register(function(t){return new Tv(t)}),this.register(function(t){return new mv(t)}),this.register(function(t){return new gv(t)}),this.register(function(t){return new _v(t)}),this.register(function(t){return new vv(t)}),this.register(function(t){return new dv(t)}),this.register(function(t){return new xv(t)}),this.register(function(t){return new pv(t)}),this.register(function(t){return new yv(t)}),this.register(function(t){return new Sv(t)}),this.register(function(t){return new cv(t)}),this.register(function(t){return new wv(t)}),this.register(function(t){return new bv(t)})}load(e,t,n,i){const s=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=ws.extractUrlBase(e);a=ws.resolveURL(c,this.path)}else a=ws.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),s.manager.itemError(e),s.manager.itemEnd(e)},l=new Xh(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{s.parse(c,a,function(h){t(h),s.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let s;const a={},o={},l=new TextDecoder;if(typeof e=="string")s=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===td){try{a[Ke.KHR_BINARY_GLTF]=new Av(e)}catch(d){i&&i(d);return}s=JSON.parse(a[Ke.KHR_BINARY_GLTF].content)}else s=JSON.parse(l.decode(e));else s=e;if(s.asset===void 0||s.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new Hv(s,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const d=this.pluginCallbacks[h](c);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[d.name]=d,a[d.name]=!0}if(s.extensionsUsed)for(let h=0;h<s.extensionsUsed.length;++h){const d=s.extensionsUsed[h],f=s.extensionsRequired||[];switch(d){case Ke.KHR_MATERIALS_UNLIT:a[d]=new hv;break;case Ke.KHR_DRACO_MESH_COMPRESSION:a[d]=new Rv(s,this.dracoLoader);break;case Ke.KHR_TEXTURE_TRANSFORM:a[d]=new Cv;break;case Ke.KHR_MESH_QUANTIZATION:a[d]=new Pv;break;default:f.indexOf(d)>=0&&o[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,s){n.parse(e,t,i,s)})}}function lv(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}const Ke={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class cv{constructor(e){this.parser=e,this.name=Ke.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const s=t[n];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const s=t.json,l=((s.extensions&&s.extensions[this.name]||{}).lights||[])[e];let c;const h=new Fe(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],Ht);const d=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new qh(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new jf(h),c.distance=d;break;case"spot":c=new $f(h),c.distance=d,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),pn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,s=n.json.nodes[e],o=(s.extensions&&s.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class hv{constructor(){this.name=Ke.KHR_MATERIALS_UNLIT}getMaterialType(){return bt}extendParams(e,t,n){const i=[];e.color=new Fe(1,1,1),e.opacity=1;const s=t.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){const a=s.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Ht),e.opacity=a[3]}s.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",s.baseColorTexture,lt))}return Promise.all(i)}}class dv{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name].emissiveStrength;return s!==void 0&&(t.emissiveIntensity=s),Promise.resolve()}}class uv{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Mn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatMap",a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(s.push(n.assignTexture(t,"clearcoatNormalMap",a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){const o=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new le(o,o)}return Promise.all(s)}}class fv{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Mn}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name];return t.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}}class pv{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Mn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceMap",a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&s.push(n.assignTexture(t,"iridescenceThicknessMap",a.iridescenceThicknessTexture)),Promise.all(s)}}class mv{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Mn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[];t.sheenColor=new Fe(0,0,0),t.sheenRoughness=0,t.sheen=1;const a=i.extensions[this.name];if(a.sheenColorFactor!==void 0){const o=a.sheenColorFactor;t.sheenColor.setRGB(o[0],o[1],o[2],Ht)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&s.push(n.assignTexture(t,"sheenColorMap",a.sheenColorTexture,lt)),a.sheenRoughnessTexture!==void 0&&s.push(n.assignTexture(t,"sheenRoughnessMap",a.sheenRoughnessTexture)),Promise.all(s)}}class gv{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Mn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&s.push(n.assignTexture(t,"transmissionMap",a.transmissionTexture)),Promise.all(s)}}class _v{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Mn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];t.thickness=a.thicknessFactor!==void 0?a.thicknessFactor:0,a.thicknessTexture!==void 0&&s.push(n.assignTexture(t,"thicknessMap",a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;const o=a.attenuationColor||[1,1,1];return t.attenuationColor=new Fe().setRGB(o[0],o[1],o[2],Ht),Promise.all(s)}}class vv{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Mn}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=i.extensions[this.name];return t.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}}class xv{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Mn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];t.specularIntensity=a.specularFactor!==void 0?a.specularFactor:1,a.specularTexture!==void 0&&s.push(n.assignTexture(t,"specularIntensityMap",a.specularTexture));const o=a.specularColorFactor||[1,1,1];return t.specularColor=new Fe().setRGB(o[0],o[1],o[2],Ht),a.specularColorTexture!==void 0&&s.push(n.assignTexture(t,"specularColorMap",a.specularColorTexture,lt)),Promise.all(s)}}class Sv{constructor(e){this.parser=e,this.name=Ke.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Mn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];return t.bumpScale=a.bumpFactor!==void 0?a.bumpFactor:1,a.bumpTexture!==void 0&&s.push(n.assignTexture(t,"bumpMap",a.bumpTexture)),Promise.all(s)}}class yv{constructor(e){this.parser=e,this.name=Ke.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Mn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const s=[],a=i.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&s.push(n.assignTexture(t,"anisotropyMap",a.anisotropyTexture)),Promise.all(s)}}class Mv{constructor(e){this.parser=e,this.name=Ke.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const s=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,s.source,a)}}class Ev{constructor(e){this.parser=e,this.name=Ke.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class Tv{constructor(e){this.parser=e,this.name=Ke.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,s=i.textures[e];if(!s.extensions||!s.extensions[t])return null;const a=s.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class wv{constructor(e){this.name=Ke.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],s=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,h=i.count,d=i.byteStride,f=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,d,f,i.mode,i.filter).then(function(u){return u.buffer}):a.ready.then(function(){const u=new ArrayBuffer(h*d);return a.decodeGltfBuffer(new Uint8Array(u),h,d,f,i.mode,i.filter),u})})}else return null}}class bv{constructor(e){this.name=Ke.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==en.TRIANGLES&&c.mode!==en.TRIANGLE_STRIP&&c.mode!==en.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),d=h.isGroup?h.children:[h],f=c[0].count,u=[];for(const g of d){const _=new He,p=new E,m=new Bn,w=new E(1,1,1),S=new qu(g.geometry,g.material,f);for(let v=0;v<f;v++)l.TRANSLATION&&p.fromBufferAttribute(l.TRANSLATION,v),l.ROTATION&&m.fromBufferAttribute(l.ROTATION,v),l.SCALE&&w.fromBufferAttribute(l.SCALE,v),S.setMatrixAt(v,_.compose(p,m,w));for(const v in l)if(v==="_COLOR_0"){const A=l[v];S.instanceColor=new Ro(A.array,A.itemSize,A.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&g.geometry.setAttribute(v,l[v]);gt.prototype.copy.call(S,g),this.parser.assignFinalMaterial(S),u.push(S)}return h.isGroup?(h.clear(),h.add(...u),h):u[0]}))}}const td="glTF",gs=12,Yc={JSON:1313821514,BIN:5130562};class Av{constructor(e){this.name=Ke.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,gs),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==td)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-gs,s=new DataView(e,gs);let a=0;for(;a<i;){const o=s.getUint32(a,!0);a+=4;const l=s.getUint32(a,!0);if(a+=4,l===Yc.JSON){const c=new Uint8Array(e,gs+a,o);this.content=n.decode(c)}else if(l===Yc.BIN){const c=gs+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Rv{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ke.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,s=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const d=Uo[h]||h.toLowerCase();o[d]=a[h]}for(const h in e.attributes){const d=Uo[h]||h.toLowerCase();if(a[h]!==void 0){const f=n.accessors[e.attributes[h]],u=zi[f.componentType];c[d]=u.name,l[d]=f.normalized===!0}}return t.getDependency("bufferView",s).then(function(h){return new Promise(function(d,f){i.decodeDracoFile(h,function(u){for(const g in u.attributes){const _=u.attributes[g],p=l[g];p!==void 0&&(_.normalized=p)}d(u)},o,c,Ht,f)})})}}class Cv{constructor(){this.name=Ke.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class Pv{constructor(){this.name=Ke.KHR_MESH_QUANTIZATION}}class nd extends zs{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[s+a];return t}interpolate_(e,t,n,i){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=i-t,d=(n-t)/h,f=d*d,u=f*d,g=e*c,_=g-c,p=-2*u+3*f,m=u-f,w=1-p,S=m-f+d;for(let v=0;v!==o;v++){const A=a[_+v+o],R=a[_+v+l]*h,P=a[g+v+o],C=a[g+v]*h;s[v]=w*A+S*R+p*P+m*C}return s}}const Lv=new Bn;class Iv extends nd{interpolate_(e,t,n,i){const s=super.interpolate_(e,t,n,i);return Lv.fromArray(s).normalize().toArray(s),s}}const en={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},zi={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Kc={9728:Bt,9729:Zt,9984:oh,9985:Ar,9986:vs,9987:In},Zc={33071:Kn,33648:Nr,10497:Xi},Da={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Uo={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Xn={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Dv={CUBICSPLINE:void 0,LINEAR:Ls,STEP:Ps},Na={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Nv(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new ve({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Fn})),r.DefaultMaterial}function oi(r,e,t){for(const n in t.extensions)r[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function pn(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Ov(r,e,t){let n=!1,i=!1,s=!1;for(let c=0,h=e.length;c<h;c++){const d=e[c];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(i=!0),d.COLOR_0!==void 0&&(s=!0),n&&i&&s)break}if(!n&&!i&&!s)return Promise.resolve(r);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const d=e[c];if(n){const f=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):r.attributes.position;a.push(f)}if(i){const f=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):r.attributes.normal;o.push(f)}if(s){const f=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):r.attributes.color;l.push(f)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],d=c[1],f=c[2];return n&&(r.morphAttributes.position=h),i&&(r.morphAttributes.normal=d),s&&(r.morphAttributes.color=f),r.morphTargetsRelative=!0,r})}function Uv(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)r.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Fv(r){let e;const t=r.extensions&&r.extensions[Ke.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Oa(t.attributes):e=r.indices+":"+Oa(r.attributes)+":"+r.mode,r.targets!==void 0)for(let n=0,i=r.targets.length;n<i;n++)e+=":"+Oa(r.targets[n]);return e}function Oa(r){let e="";const t=Object.keys(r).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+r[t[n]]+";";return e}function Fo(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Bv(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const kv=new He;class Hv{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new lv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,s=!1,a=-1;if(typeof navigator<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,s=o.indexOf("Firefox")>-1,a=s?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||s&&a<98?this.textureLoader=new Yf(this.options.manager):this.textureLoader=new ep(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Xh(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return oi(s,o,i),pn(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,s=t.length;i<s;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,s=e.length;i<s;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),s=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())s(h,o.children[c])};return s(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const s=e(t[i]);s&&n.push(s)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(s){return s.loadNode&&s.loadNode(t)});break;case"mesh":i=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(s,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ke.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(s,a){n.load(ws.resolveURL(t.uri,i.path),s,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,s=t.byteOffset||0;return n.slice(s,s+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=Da[i.type],o=zi[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new kt(c,a,l))}const s=[];return i.bufferView!==void 0?s.push(this.getDependency("bufferView",i.bufferView)):s.push(null),i.sparse!==void 0&&(s.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(s).then(function(a){const o=a[0],l=Da[i.type],c=zi[i.componentType],h=c.BYTES_PER_ELEMENT,d=h*l,f=i.byteOffset||0,u=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0;let _,p;if(u&&u!==d){const m=Math.floor(f/u),w="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+m+":"+i.count;let S=t.cache.get(w);S||(_=new c(o,m*u,i.count*u/h),S=new Ah(_,u/h),t.cache.add(w,S)),p=new Ns(S,l,f%u/h,g)}else o===null?_=new c(i.count*l):_=new c(o,f,i.count*l),p=new kt(_,l,g);if(i.sparse!==void 0){const m=Da.SCALAR,w=zi[i.sparse.indices.componentType],S=i.sparse.indices.byteOffset||0,v=i.sparse.values.byteOffset||0,A=new w(a[1],S,i.sparse.count*m),R=new c(a[2],v,i.sparse.count*l);o!==null&&(p=new kt(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let P=0,C=A.length;P<C;P++){const M=A[P];if(p.setX(M,R[P*l]),l>=2&&p.setY(M,R[P*l+1]),l>=3&&p.setZ(M,R[P*l+2]),l>=4&&p.setW(M,R[P*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=g}return p})}loadTexture(e){const t=this.json,n=this.options,s=t.textures[e].source,a=t.images[s];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,s,o)}loadTextureImage(e,t,n){const i=this,s=this.json,a=s.textures[e],o=s.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const f=(s.samplers||{})[a.sampler]||{};return h.magFilter=Kc[f.magFilter]||Zt,h.minFilter=Kc[f.minFilter]||In,h.wrapS=Zc[f.wrapS]||Xi,h.wrapT=Zc[f.wrapT]||Xi,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Bt&&h.minFilter!==Zt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,s=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(d){c=!0;const f=new Blob([d],{type:a.mimeType});return l=o.createObjectURL(f),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(l).then(function(d){return new Promise(function(f,u){let g=f;t.isImageBitmapLoader===!0&&(g=function(_){const p=new At(_);p.needsUpdate=!0,f(p)}),t.load(ws.resolveURL(d,s.path),g,void 0,u)})}).then(function(d){return c===!0&&o.revokeObjectURL(l),pn(d,a),d.userData.mimeType=a.mimeType||Bv(a.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),d});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const s=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),s.extensions[Ke.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[Ke.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=s.associations.get(a);a=s.extensions[Ke.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),s.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,s=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new Ih,dn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new Fr,dn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||s||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),s&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),s&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return ve}loadMaterial(e){const t=this,n=this.json,i=this.extensions,s=n.materials[e];let a;const o={},l=s.extensions||{},c=[];if(l[Ke.KHR_MATERIALS_UNLIT]){const d=i[Ke.KHR_MATERIALS_UNLIT];a=d.getMaterialType(),c.push(d.extendParams(o,s,t))}else{const d=s.pbrMetallicRoughness||{};if(o.color=new Fe(1,1,1),o.opacity=1,Array.isArray(d.baseColorFactor)){const f=d.baseColorFactor;o.color.setRGB(f[0],f[1],f[2],Ht),o.opacity=f[3]}d.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",d.baseColorTexture,lt)),o.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,o.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",d.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",d.metallicRoughnessTexture))),a=this._invokeOne(function(f){return f.getMaterialType&&f.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(f){return f.extendMaterialParams&&f.extendMaterialParams(e,o)})))}s.doubleSided===!0&&(o.side=Et);const h=s.alphaMode||Na.OPAQUE;if(h===Na.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Na.MASK&&(o.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&a!==bt&&(c.push(t.assignTexture(o,"normalMap",s.normalTexture)),o.normalScale=new le(1,1),s.normalTexture.scale!==void 0)){const d=s.normalTexture.scale;o.normalScale.set(d,d)}if(s.occlusionTexture!==void 0&&a!==bt&&(c.push(t.assignTexture(o,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&a!==bt){const d=s.emissiveFactor;o.emissive=new Fe().setRGB(d[0],d[1],d[2],Ht)}return s.emissiveTexture!==void 0&&a!==bt&&c.push(t.assignTexture(o,"emissiveMap",s.emissiveTexture,lt)),Promise.all(c).then(function(){const d=new a(o);return s.name&&(d.name=s.name),pn(d,s),t.associations.set(d,{materials:e}),s.extensions&&oi(i,d,s),d})}createUniqueName(e){const t=ot.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function s(o){return n[Ke.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return $c(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=Fv(c),d=i[h];if(d)a.push(d.promise);else{let f;c.extensions&&c.extensions[Ke.KHR_DRACO_MESH_COMPRESSION]?f=s(c):f=$c(new Tt,c,t),i[h]={primitive:c,promise:f},a.push(f)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,s=n.meshes[e],a=s.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?Nv(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],d=[];for(let u=0,g=h.length;u<g;u++){const _=h[u],p=a[u];let m;const w=c[u];if(p.mode===en.TRIANGLES||p.mode===en.TRIANGLE_STRIP||p.mode===en.TRIANGLE_FAN||p.mode===void 0)m=s.isSkinnedMesh===!0?new Gu(_,w):new Se(_,w),m.isSkinnedMesh===!0&&m.normalizeSkinWeights(),p.mode===en.TRIANGLE_STRIP?m.geometry=qc(m.geometry,mh):p.mode===en.TRIANGLE_FAN&&(m.geometry=qc(m.geometry,bo));else if(p.mode===en.LINES)m=new Co(_,w);else if(p.mode===en.LINE_STRIP)m=new Qo(_,w);else if(p.mode===en.LINE_LOOP)m=new $u(_,w);else if(p.mode===en.POINTS)m=new Ju(_,w);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(m.geometry.morphAttributes).length>0&&Uv(m,s),m.name=t.createUniqueName(s.name||"mesh_"+e),pn(m,s),p.extensions&&oi(i,m,p),t.assignFinalMaterial(m),d.push(m)}for(let u=0,g=d.length;u<g;u++)t.associations.set(d[u],{meshes:e,primitives:u});if(d.length===1)return s.extensions&&oi(i,d[0],s),d[0];const f=new et;s.extensions&&oi(i,f,s),t.associations.set(f,{meshes:e});for(let u=0,g=d.length;u<g;u++)f.add(d[u]);return f})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new wt(Dn.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Gr(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),pn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,s=t.joints.length;i<s;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const s=i.pop(),a=i,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const d=a[c];if(d){o.push(d);const f=new He;s!==null&&f.fromArray(s.array,c*16),l.push(f)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Jo(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],s=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let d=0,f=i.channels.length;d<f;d++){const u=i.channels[d],g=i.samplers[u.sampler],_=u.target,p=_.node,m=i.parameters!==void 0?i.parameters[g.input]:g.input,w=i.parameters!==void 0?i.parameters[g.output]:g.output;_.node!==void 0&&(a.push(this.getDependency("node",p)),o.push(this.getDependency("accessor",m)),l.push(this.getDependency("accessor",w)),c.push(g),h.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(d){const f=d[0],u=d[1],g=d[2],_=d[3],p=d[4],m=[];for(let S=0,v=f.length;S<v;S++){const A=f[S],R=u[S],P=g[S],C=_[S],M=p[S];if(A===void 0)continue;A.updateMatrix&&A.updateMatrix();const y=n._createAnimationTracks(A,R,P,C,M);if(y)for(let L=0;L<y.length;L++)m.push(y[L])}const w=new Hf(s,void 0,m);return pn(w,i),w})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(s){const a=n._getNodeRef(n.meshCache,i.mesh,s);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],s=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([s,Promise.all(a),l]).then(function(c){const h=c[0],d=c[1],f=c[2];f!==null&&h.traverse(function(u){u.isSkinnedMesh&&u.bind(f,kv)});for(let u=0,g=d.length;u<g;u++)h.add(d[u]);return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const s=t.nodes[e],a=s.name?i.createUniqueName(s.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),s.camera!==void 0&&o.push(i.getDependency("camera",s.camera).then(function(c){return i._getNodeRef(i.cameraCache,s.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(s.isBone===!0?h=new Ph:c.length>1?h=new et:c.length===1?h=c[0]:h=new gt,h!==c[0])for(let d=0,f=c.length;d<f;d++)h.add(c[d]);if(s.name&&(h.userData.name=s.name,h.name=a),pn(h,s),s.extensions&&oi(n,h,s),s.matrix!==void 0){const d=new He;d.fromArray(s.matrix),h.applyMatrix4(d)}else s.translation!==void 0&&h.position.fromArray(s.translation),s.rotation!==void 0&&h.quaternion.fromArray(s.rotation),s.scale!==void 0&&h.scale.fromArray(s.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(s.mesh!==void 0&&i.meshCache.refs[s.mesh]>1){const d=i.associations.get(h);i.associations.set(h,{...d})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,s=new et;n.name&&(s.name=i.createUniqueName(n.name)),pn(s,n),n.extensions&&oi(t,s,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,d=l.length;h<d;h++)s.add(l[h]);const c=h=>{const d=new Map;for(const[f,u]of i.associations)(f instanceof dn||f instanceof At)&&d.set(f,u);return h.traverse(f=>{const u=i.associations.get(f);u!=null&&d.set(f,u)}),d};return i.associations=c(s),s})}_createAnimationTracks(e,t,n,i,s){const a=[],o=e.name?e.name:e.uuid,l=[];Xn[s.path]===Xn.weights?e.traverse(function(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}):l.push(o);let c;switch(Xn[s.path]){case Xn.weights:c=Zi;break;case Xn.rotation:c=$i;break;case Xn.translation:case Xn.scale:c=Ji;break;default:n.itemSize===1?c=Zi:c=Ji;break}const h=i.interpolation!==void 0?Dv[i.interpolation]:Ls,d=this._getArrayFromAccessor(n);for(let f=0,u=l.length;f<u;f++){const g=new c(l[f]+"."+Xn[s.path],t.array,d,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),a.push(g)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Fo(t.constructor),i=new Float32Array(t.length);for(let s=0,a=t.length;s<a;s++)i[s]=t[s]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof $i?Iv:nd;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function zv(r,e,t){const n=e.attributes,i=new Be;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new E(l[0],l[1],l[2]),new E(c[0],c[1],c[2])),o.normalized){const h=Fo(zi[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const s=e.targets;if(s!==void 0){const o=new E,l=new E;for(let c=0,h=s.length;c<h;c++){const d=s[c];if(d.POSITION!==void 0){const f=t.json.accessors[d.POSITION],u=f.min,g=f.max;if(u!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(u[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(u[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(u[2]),Math.abs(g[2]))),f.normalized){const _=Fo(zi[f.componentType]);l.multiplyScalar(_)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}r.boundingBox=i;const a=new Sn;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,r.boundingSphere=a}function $c(r,e,t){const n=e.attributes,i=[];function s(a,o){return t.getDependency("accessor",a).then(function(l){r.setAttribute(o,l)})}for(const a in n){const o=Uo[a]||a.toLowerCase();o in r.attributes||i.push(s(n[a],o))}if(e.indices!==void 0&&!r.index){const a=t.getDependency("accessor",e.indices).then(function(o){r.setIndex(o)});i.push(a)}return je.workingColorSpace!==Ht&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${je.workingColorSpace}" not supported.`),pn(r,e),zv(r,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Ov(r,e.targets,t):r})}class Vv{_rolling=[];frontPivots=[];_pivots={FL:void 0,FR:void 0,RL:void 0,RR:void 0};tireRadius;leftX;rightX;axleDistance;constructor(e=.32,t=-1,n=.7,i=2.5){this.tireRadius=e,this.leftX=t,this.rightX=n,this.axleDistance=i}get trackWidth(){return this.rightX-this.leftX}get rolling(){return this._rolling}buildWheels(e){for(const t of["FL","FR","RL","RR"]){const n=t.startsWith("F"),i=t.endsWith("L"),s=n?-this.axleDistance/2:this.axleDistance/2,a=i?this.leftX:this.rightX,o=new et;o.name=`Vehicle3_${t}_SteeringPivot`,o.position.set(a,this.tireRadius,s);const l=new et;l.name=`Vehicle3_${t}_RollingPivot`,o.add(l),this.buildTyre(l),e.add(o),this._rolling.push(l),this._pivots[t]=o,n&&this.frontPivots.push(o)}}getWheel(e){const t=this._pivots[e];if(!t)throw new Error(`Vehicle3WheelAssembly: wheel ${e} not built yet`);return t}buildTyre(e){const t=new ve({color:1382169,roughness:.9}),n=new ve({color:1054752,roughness:.4}),i=new ve({color:12240332,roughness:.24,metalness:.8}),s=.24,a=new Vt(this.tireRadius,this.tireRadius,s,32);a.rotateZ(Math.PI/2);const o=new Se(a,t);o.castShadow=!0,o.receiveShadow=!0,e.add(o);const l=new Vt(.22,.22,.012,24);l.rotateZ(Math.PI/2),e.add(new Se(l,n));const c=new Se(new Bs(.205,.018,8,32),i);c.rotation.y=Math.PI/2,e.add(c);for(let d=0;d<8;d++){const f=d*Math.PI/4,u=new Se(new rt(.018,.035,.33),i);u.rotation.x=f,e.add(u)}const h=new Vt(.06,.06,.025,16);h.rotateZ(Math.PI/2),e.add(new Se(h,i))}updateRolling(e,t){const n=-e/this.tireRadius*t;for(const i of this._rolling)i.rotation.x+=n}reset(){for(const e of this._rolling)e.rotation.x=0;for(const e of this.frontPivots)e.rotation.y=0}}class Xr extends ll{wheelAssy;get wheelAssembly(){return this.wheelAssy}tireRadius=.32;lamps=[];build(){this.root.name="vehicle3-glb"}static async create(e=new URL("models/toyota_vios_g.glb",document.baseURI).href){const t=await new ed().loadAsync(e),n=new Xr;return n.attachModel(t.scene),n}attachModel(e){if(this.wheelAssy)throw new Error("Vehicle3 already has a model");const t=e.children.find(a=>a.type==="Object3D"||a.type==="Group");t&&Math.abs(t.rotation.x- -Math.PI/2)<.01||e.rotation.set(-Math.PI/2,0,0),e.rotation.y=Math.PI,this.visual.add(e),e.updateMatrixWorld(!0);const i=new Be;e.traverse(a=>{if(!(a instanceof Se))return;a.geometry.computeBoundingBox();const o=a.geometry.boundingBox.clone();o.applyMatrix4(a.matrixWorld),i.union(o)});const s=-i.min.y;e.position.set(0,s,0),this.root.updateWorldMatrix(!0,!0),e.traverse(a=>{a instanceof Se&&(a.castShadow=!0,a.receiveShadow=!0)}),this.wheelAssy=new Vv(.32,-1,.7,2.5),this.wheelAssy.buildWheels(this.visual),this.frontPivots=this.wheelAssy.frontPivots}updateSignalBlink(){const e=performance.now()%1100<550;for(const t of this.lamps){const n=this.signals.hazard||(t.left?this.signals.left:this.signals.right);t.material.color.copy(t.base),t.material.emissive.copy(t.emissive),n&&e&&(t.material.color.setHex(16761667),t.material.emissive.setHex(10051584))}}update(e,t){const n=t.isDown("KeyA")||t.isDown("ArrowLeft"),i=t.isDown("KeyD")||t.isDown("ArrowRight"),s=t.getAnalog("steeringActive")===1;this.steeringSystem.update(e,Number(i)-Number(n),this.speed,s?((t.getAnalog("steering")??.5)*2-1)*Ft.maxSteeringWheelAngle:void 0),this.steering=this.steeringSystem.centerSteerAngle,this.speed=this.transmission.update(e,t,this.speed,this.slopeAngle);const a=Qh(this.root.position.x,this.root.position.z,this.root.rotation.y,this.speed,this.steering,e);this.root.position.x=a.x,this.root.position.z=a.z,this.root.rotation.y=a.heading;for(const o of this.frontPivots)o.rotation.y=-(o.position.x<0?this.steeringSystem.frontLeftAngle:this.steeringSystem.frontRightAngle);this.wheelAssy.updateRolling(this.speed,e),this.updateSignalBlink()}reset(){super.reset(),this.wheelAssy.reset(),this.updateSignalBlink()}}class Gv{root=new et;width=8;length=26;height=1.5;rampLength=10;probe=new E;constructor(e,t,n="vertical"){this.root.name="hill-start-bridge",this.root.position.set(e,0,t),this.root.rotation.y=n==="horizontal"?-Math.PI/2:0,this.build(),this.root.updateMatrixWorld(!0)}elevation(e){const t=Dn.clamp((this.length/2-Math.abs(e))/this.rampLength,0,1);return this.height*t*t*(3-2*t)}surfaceHeight(e,t){if(this.probe.set(e,0,t),this.root.worldToLocal(this.probe),!(Math.abs(this.probe.x)>this.width/2||Math.abs(this.probe.z)>this.length/2))return this.root.position.y+.06+this.elevation(this.probe.z)}build(){const e=new ve({color:"#2a2a2a",roughness:.95});new ve({color:10988976,roughness:.9});const t=new ve({color:16777215,roughness:.8}),n=new ve({color:14170939,roughness:.8}),i=new ve({color:16175948,roughness:.8}),s=new ve({color:13095125,metalness:.65,roughness:.35}),a=(u,g,_,p,m,w,S)=>{const v=new Se(new rt(u,g,_),S);return v.position.set(p,m,w),v.receiveShadow=!0,v.castShadow=!0,this.root.add(v),v},o=(u,g,_,p,m,w,S)=>{const v=.06+this.elevation(_),A=.06+this.elevation(p),R=a(g,w,Math.hypot(p-_,A-v),u,(v+A)/2+m,(_+p)/2,S);R.rotation.x=-Math.atan2(A-v,p-_)},l=.25;for(let u=0;u<this.length/l;u++){const g=-this.length/2+u*l,_=g+l,p=(g+_)/2;this.elevation(p),o(0,this.width,g,_,-.01,.02,e),Math.abs(p-5)>.3&&o(0,.15,g,_,.012,.008,t);for(const m of[-1,1])o(m*(this.width/2-.1),.2,g,_,.025,.05,Math.floor(u/3)%2===0?t:n),o(m*(this.width/2+.1),.08,g,_,.9,.08,s)}for(let u=-12;u<=12;u+=2)for(const g of[-1,1])a(.1,.95,.1,g*(this.width/2+.1),.06+this.elevation(u)+.475,u,s);o(0,this.width-.4,9.6,9.4,.02,.012,i),o(0,this.width-.4,5.6,5.4,.02,.012,t);const c=document.createElement("canvas");c.width=1024,c.height=256;const h=c.getContext("2d");h.fillStyle="#1453a0",h.fillRect(0,0,1024,256),h.strokeStyle="#ffffff",h.lineWidth=12,h.strokeRect(10,10,1004,236),h.fillStyle="#ffffff",h.font="bold 66px Arial",h.textAlign="center",h.textBaseline="middle",h.fillText("DỪNG XE NGANG DỐC CẦU",512,128,960);const d=new Kt(c);d.colorSpace=lt;const f=new Se(new xt(4.2,1.05),new ve({map:d,side:Et}));f.position.set(this.width/2+2.5,2.6,10),this.root.add(f),a(.12,2.6,.12,this.width/2+2.5,1.3,10,s)}}class Ln{constructor(e,t,n=8,i="vertical",s={}){this.width=n,this.root.name="vehicle-triggered-traffic-light",this.root.position.set(e,0,t),this.root.rotation.y=typeof i=="number"?i:i==="horizontal"?-Math.PI/2:0;const a=s.stopLineZ??7,o=s.triggerStart??0;this.markerId=s.markerId,this.stopLineZ=a,this.triggerStart=o,this.triggerLength=s.triggerLength??2,this.stopLineHalfWidth=(n-.8)/2,this.stopLineX=s.stopLineX??-n+1,this.triggerStartX=s.triggerStartX??this.stopLineX-this.stopLineHalfWidth,this.triggerLengthX=s.triggerLengthX??this.stopLineHalfWidth*2;const l=new ve({color:2107181,roughness:.6}),c=new ve({color:10332336,metalness:.6,roughness:.4}),h=(p,m,w,S,v,A,R)=>{const P=new Se(new rt(p,m,w),R);P.position.set(S,v,A),P.castShadow=!0,P.receiveShadow=!0,this.root.add(P)},d=-n/2-.55;h(.16,3.6,.16,d,1.8,0,c),h(.8,1.6,.4,d,3.45,0,l);const f=[{offsetX:0,offsetZ:.211,rotationY:0,lensRadius:.25,timerSize:[.85,.425]},{offsetX:0,offsetZ:-.211,rotationY:Math.PI,lensRadius:.25,timerSize:[.85,.425]},{offsetX:.411,offsetZ:0,rotationY:Math.PI/2,lensRadius:.18,timerSize:[.4,.2]}];for(const p of f)for(const[m,w]of[[3.8,this.red],[3.12,this.green]]){const S=new Se(new el(p.lensRadius,32),w);S.position.set(d+p.offsetX,m,p.offsetZ),S.rotation.y=p.rotationY,this.root.add(S)}h(n/2-.4,.012,.12,this.stopLineX,.09,a,new ve({color:16175948,roughness:.8}));const u=(n-.8)/2,g=Math.max(this.triggerLength,.5),_=new Se(new rt(u,.04,g),new bt({color:16719920,transparent:!0,opacity:.35,depthWrite:!1}));_.name="traffic-light-trigger-zone",_.position.set(this.triggerStartX+this.triggerLengthX/2,.07,this.triggerStart+this.triggerLength/2),this.root.add(_),this.canvas.width=256,this.canvas.height=128,this.texture=new Kt(this.canvas),this.texture.colorSpace=lt;for(const p of f){const m=new Se(new xt(p.timerSize[0],p.timerSize[1]),new bt({map:this.texture,side:Et}));m.position.set(d+p.offsetX,4.55,p.offsetZ*(p.offsetX===0?1.04:0)),m.rotation.y=p.rotationY,this.root.add(m)}this.refresh()}width;root=new et;elapsed=0;active=!1;markerId;stopLineZ;triggerStart;triggerLength;stopLineX;stopLineHalfWidth;triggerStartX;triggerLengthX;onMarkerTriggered;red=new ve({color:4395027,emissive:16717860,side:Et});green=new ve({color:1062947,emissive:1507176,side:Et});canvas=document.createElement("canvas");texture;display="";probe=new E;static RED_DURATION_SEC=15;static GREEN_DURATION_SEC=10;static get CYCLE_SEC(){return Ln.RED_DURATION_SEC+Ln.GREEN_DURATION_SEC}get phase(){return this.active?this.elapsed<Ln.RED_DURATION_SEC?"red":"green":"idle"}get remainingSeconds(){return this.active?Math.ceil((this.phase==="red"?Ln.RED_DURATION_SEC:Ln.CYCLE_SEC)-this.elapsed):0}update(e,t){this.active?this.elapsed=(this.elapsed+Math.max(0,e))%Ln.CYCLE_SEC:(this.root.updateWorldMatrix(!0,!1),this.probe.copy(t),this.root.worldToLocal(this.probe),this.probe.x>=this.triggerStartX&&this.probe.x<this.triggerStartX+this.triggerLengthX&&this.probe.z>=this.triggerStart&&this.probe.z<this.triggerStart+this.triggerLength&&(this.active=!0,this.elapsed=0,this.markerId&&this.onMarkerTriggered?.(this.markerId))),this.refresh()}reset(){this.active=!1,this.elapsed=0,this.refresh()}goGreenNow(){this.active=!0,this.elapsed=Ln.RED_DURATION_SEC,this.refresh()}refresh(){this.red.emissiveIntensity=this.phase==="red"?2:0,this.green.emissiveIntensity=this.phase==="green"?2:0;const e=this.phase==="idle"?"--":String(this.remainingSeconds),t=`${this.phase}:${e}`;if(t===this.display)return;this.display=t;const n=this.canvas.getContext("2d");n.fillStyle="#111820",n.fillRect(0,0,256,128),n.fillStyle=this.phase==="red"?"#ff3542":this.phase==="green"?"#24ff78":"#85929e",n.font="bold 100px Arial",n.textAlign="center",n.textBaseline="middle",n.fillText(e,128,68),this.texture.needsUpdate=!0}}class Jc{root=new et;constructor({title:e,subtitle:t,x:n,z:i,rotation:s=0,width:a=5}){this.root.name="exercise-sign",this.root.position.set(n,0,i),this.root.rotation.y=s;const o=document.createElement("canvas");o.width=1024,o.height=384;const l=o.getContext("2d");l.fillStyle="#1453a0",l.fillRect(0,0,1024,384),l.strokeStyle="#ffffff",l.lineWidth=10,l.strokeRect(10,10,1004,364),l.fillStyle="#ffffff",l.textAlign="center",l.textBaseline="middle";const c=e.split(`
`),h=t?220:300;l.font=`bold ${Math.min(66,h/c.length*.75)}px Arial`,c.forEach((R,P)=>l.fillText(R,512,40+h*(P+.5)/c.length,960)),t&&(l.font="40px Arial",l.fillText(t,512,310,960));const d=new Kt(o);d.colorSpace=lt;const f=a*384/1024,u=new Se(new xt(a,f),new ve({map:d,side:Et})),g=2.5,_=g+f/2;u.position.y=_,u.position.z=.02;const p=g,m=a/2-.12,w=new rt(.12,p,.12),S=new ve({color:13095125,metalness:.6,roughness:.4}),v=new Se(w,S);v.position.set(-m,p/2,-.02),v.castShadow=!0;const A=new Se(w,S);A.position.set(m,p/2,-.02),A.castShadow=!0,this.root.add(u,v,A)}}class Wv{root=new et;constructor({x:e,z:t,roadWidth:n=8}){this.root.name="EX02_SIGN_PEDESTRIAN",this.root.position.set(e,0,t),this.root.rotation.y=Math.PI/2;const i=-(n/2+1.5),s=document.createElement("canvas");s.width=512,s.height=512;const a=s.getContext("2d");a.fillStyle="#ffcc00",a.fillRect(0,0,512,512),a.strokeStyle="#1a1a1a",a.lineWidth=20,a.strokeRect(20,20,472,472),a.fillStyle="#1a1a1a",a.font="bold 180px Arial",a.textAlign="center",a.textBaseline="middle",a.fillText("🚶",256,256);const o=new Kt(s);o.colorSpace=lt;const l=new Se(new xt(1.2,1.2),new ve({map:o,side:Et}));l.position.set(i,2.5,0),l.castShadow=!0,this.root.add(l);const c=new Se(new Vt(.06,.06,2.5,12),new ve({color:13095125,metalness:.6,roughness:.4}));c.position.set(i,1.25,0),c.castShadow=!0,this.root.add(c)}}let br=null,Xv=new ed;class Dr{root=new et;constructor({x:e,z:t,roadWidth:n=8,scale:i=.012}){this.root.name="EX02_SIGN_STOP",this.root.position.set(e,0,t),this.root.rotation.y=-Math.PI/2;const s=n/2+1.5;if(br){const a=br.clone(!0);a.scale.setScalar(i),a.position.set(s,0,0),a.traverse(o=>{if(o.isMesh){const l=o;l.castShadow=!0,l.receiveShadow=!0}}),this.root.add(a)}else{const a=document.createElement("canvas");a.width=512,a.height=512;const o=a.getContext("2d");o.fillStyle="#cc0000",o.fillRect(0,0,512,512),o.strokeStyle="#ffffff",o.lineWidth=28,o.strokeRect(20,20,472,472),o.fillStyle="#ffffff",o.font="bold 220px Arial",o.textAlign="center",o.textBaseline="middle",o.fillText("STOP",256,256);const l=new Kt(a);l.colorSpace=lt;const c=new Se(new xt(1.2,1.2),new ve({map:l,side:Et}));c.scale.setScalar(i),c.position.set(s,2.5*i,0),c.castShadow=!0,this.root.add(c);const h=new Se(new Vt(.06,.06,2.5*i,12),new ve({color:13095125,metalness:.6,roughness:.4}));h.position.set(s,2.5*i/2,0),h.castShadow=!0,this.root.add(h)}}static async preload(){if(!br)try{br=(await Xv.loadAsync("/models/stop_sign_road_sign.glb")).scene}catch{}}}class qv{root=new et;penaltyZones=[];width=2.2*1.8;turningRadius=Math.hypot(2.65/Math.tan(Dn.degToRad(31))+.94,1.3);curveScale=1;outerRadius=(this.turningRadius+1.2-this.width/2)*this.curveScale+this.width/2;innerRadius=this.outerRadius-this.width;centreSpacing=this.outerRadius+this.innerRadius;exit;constructor(e,t){this.root.name="winding-course";const n=this.centreSpacing/2;this.exit=new E(e,.06,t+4*n);const i=new ve({color:"#2a2a2a",roughness:.95}),s=new ve({color:16777215,roughness:.85}),a=new ve({color:14170939,roughness:.85}),o=(l,c,h,d,f,u,g,_)=>{const p=new Qi,m=Math.max(2,Math.ceil(Math.abs(f-d)*64));for(let v=0;v<=m;v++){const A=d+(f-d)*v/m,R=e+h*Math.cos(A),P=l+h*Math.sin(A);v===0?p.moveTo(R,-P):p.lineTo(R,-P)}for(let v=m;v>=0;v--){const A=d+(f-d)*v/m;p.lineTo(e+c*Math.cos(A),-(l+c*Math.sin(A)))}p.closePath();const w=new pi(p,{depth:u,bevelEnabled:!1});w.translate(0,0,-u),w.rotateX(-Math.PI/2);const S=new Se(w,_);return S.position.y=g,S.receiveShadow=!0,this.root.add(S),S};for(const[l,c,h]of[[t+n,-Math.PI/2,-3*Math.PI/2],[t+3*n,-Math.PI/2,Math.PI/2]]){o(l,this.innerRadius,this.outerRadius,c,h,.08,.06,i);for(const[d,f,u]of[[this.innerRadius,this.innerRadius-.2,this.innerRadius],[this.outerRadius,this.outerRadius,this.outerRadius+.2]]){o(l,d-.05,d+.05,c,h,.008,.075,s);const g=Math.ceil(Math.PI*d/.8);for(let p=0;p<g;p++){const m=c+(h-c)*p/g,w=c+(h-c)*(p+1)/g;o(l,f,u,m,w,.05,.11,p%2?a:s).castShadow=!0}const _=Math.ceil(Math.PI*d/.15);for(let p=0;p<_;p++){const m=c+(h-c)*p/_,w=c+(h-c)*(p+1)/_,S=new Be().setFromPoints([new E(e+d*Math.cos(m),.1,l+d*Math.sin(m)),new E(e+d*Math.cos(w),.9,l+d*Math.sin(w))]);S.expandByVector(new E(.125,.1,.125)),this.penaltyZones.push(S)}}}}}class Yv{root=new et;penaltyZones=[];a=4.4;b=1.8;B1=.22;Bvb=this.B1+.2;Lvb=this.a;Sv=1.5*this.a;Lv=2*this.a;Bv=2.2*this.b;entryLength;entry;exit;startYellowLine;endYellowLine;wheelTrackZoneLocal;boundarySensorsLocal=[];startYellowSensorLocal;endYellowSensorLocal;constructor(e,t,n){this.root.name="wheel-track-course",this.entryLength=n;const i=this.Bv/2,s=0,a=0,o=a-n,l=s-this.Lv,c=o+i-this.Sv;this.entry=new E(e+s,.06,t+a),this.exit=new E(e+l,.06,t+c);const h=[[s+i,a],[s+i,o-i],[l+i,o-i],[l+i,c],[l-i,c],[l-i,o+i],[s-i,o+i],[s-i,a]];this.buildSurface(h),this.buildBoundaries(h),this.buildArrows(s,a,o,l,c,i),this.buildWheelTracks(s,a),this.buildYellowLines(s,a,o,l,c,i),this.wheelTrackZoneLocal=new Be().setFromCenterAndSize(new E(0,0,-this.Lvb/2),new E(this.Bvb,.4,this.Lvb)),this.buildBoundarySensors(h),this.root.position.set(e,0,t)}buildSurface(e){const t=new Qi;e.forEach(([i,s],a)=>{a===0?t.moveTo(i,-s):t.lineTo(i,-s)}),t.closePath();const n=new Se(new pi(t,{depth:.08,bevelEnabled:!1}),new ve({color:"#2a2a2a",roughness:.95}));n.rotation.x=-Math.PI/2,n.geometry.translate(0,0,-.08),n.position.y=.06,n.receiveShadow=!0,n.name="wheel-track-course-surface",this.root.add(n)}buildBoundaries(e){for(let t=0;t<e.length-1;t++){if(t===3)continue;const[n,i]=e[t],[s,a]=e[t+1],o=Math.abs(s-n),l=Math.abs(a-i);this.addLine((n+s)/2,(i+a)/2,o||.1,l||.1,16777215,!0);const c=Math.hypot(s-n,a-i),h=new et;h.position.set((n+s)/2,0,(i+a)/2),h.rotation.y=Math.atan2(s-n,a-i),this.buildRoadEdgePattern(h,0,0,.4,c,"left"),this.root.add(h)}}buildArrows(e,t,n,i,s,a){this.addRoadArrow(e,t-1,this.Bv,3,"straight");const o=new et;o.position.set((e+i)/2,0,n),o.rotation.y=Math.PI/2,this.addRoadArrowTo(0,0,this.Bv,this.Lv-this.Bv,"straight",o),this.root.add(o),this.addRoadArrow(i,(n-a+s)/2,this.Bv,this.Sv-this.Bv,"straight")}buildWheelTracks(e,t){const i=t-this.a,s=e+.94;for(const a of[-1,1]){const o=s+a*(this.Bvb+.05)/2;this.addLine(o,i,.05,this.Lvb,16777215),this.penaltyZones.push(new Be().setFromCenterAndSize(new E(o,.5,i),new E(.05+this.B1,1,this.Lvb)))}}buildBoundarySensors(e){for(let n=0;n<e.length-1;n++){if(n===3)continue;const[i,s]=e[n],[a,o]=e[n+1],l=Math.hypot(a-i,o-s),c=(i+a)/2,h=(s+o)/2;Math.abs(a-i)>Math.abs(o-s)?this.boundarySensorsLocal.push(new Be(new E(c-l/2,-1,h-.25/2),new E(c+l/2,1,h+.25/2))):this.boundarySensorsLocal.push(new Be(new E(c-.25/2,-1,h-l/2),new E(c+.25/2,1,h+l/2)))}}buildYellowLines(e,t,n,i,s,a){const o=this.Bv,l=.15,c=.085,h=.05,d=new ve({color:16765952,roughness:.7,emissive:5583616}),f=this.Sv-5,u=new Se(new rt(o,h,l),d);u.position.set(0,c,f),u.name="EX04_START_YELLOW_LINE",this.root.add(u),this.startYellowLine=u,this.startYellowSensorLocal=new Be(new E(-o/2,-1,f-l/2),new E(o/2,1,f+l/2));const g=i,_=s,p=new Se(new rt(this.Bv,h,l),d);p.position.set(g,c,_),p.name="EX04_END_YELLOW_LINE",this.root.add(p),this.endYellowLine=p;const m=this.Bv/2;this.endYellowSensorLocal=new Be(new E(g-m,-1,_-l/2),new E(g+m,1,_+l/2))}addLine(e,t,n,i,s,a=!1){const o=new Se(new rt(n,.03,i),new ve({color:s,roughness:.7}));o.position.set(e,.075,t),this.root.add(o)}buildRoadEdgePattern(e,t,n,i,s,a){const h=Math.ceil(s/.8);for(let d=0;d<h;d++){const f=Math.min(.8,s-d*.8),u=d%2===0?16777215:14170939,g=new Se(new rt(.2,.05,f),new ve({color:u,roughness:.85})),_=a==="left"?t-i/2+.2/2:t+i/2-.2/2;g.position.set(_,.08/2+.05/2+.02,n-s/2+d*.8+f/2),g.castShadow=!0,g.receiveShadow=!0,e.add(g)}}addRoadArrow(e,t,n,i,s){const a=this.createArrowTexture(s),o=new Se(new xt(Math.min(n*.32,s==="straight"?1.2:1.9),Math.min(i*.35,3.4)),new bt({map:a,transparent:!0}));o.rotation.x=-Math.PI/2,o.position.set(e,.081,t),this.root.add(o)}addRoadArrowTo(e,t,n,i,s,a){const o=this.createArrowTexture(s),l=new Se(new xt(Math.min(n*.32,s==="straight"?1.2:1.9),Math.min(i*.35,3.4)),new bt({map:o,transparent:!0}));l.rotation.x=-Math.PI/2,l.position.set(e,.081,t),a.add(l)}createArrowTexture(e){const t=document.createElement("canvas");t.width=256,t.height=512;const n=t.getContext("2d");n.clearRect(0,0,t.width,t.height),n.fillStyle="white",n.strokeStyle="white",n.lineWidth=28,n.lineCap="round",n.lineJoin="round";const i=t.width/2;e==="straight"?(n.beginPath(),n.moveTo(i,420),n.lineTo(i,140),n.stroke(),n.beginPath(),n.moveTo(i,90),n.lineTo(i-55,165),n.lineTo(i-20,165),n.lineTo(i-20,250),n.lineTo(i+20,250),n.lineTo(i+20,165),n.lineTo(i+55,165),n.closePath(),n.fill()):(e==="left"||e==="right")&&(n.save(),e==="left"&&(n.translate(t.width,0),n.scale(-1,1)),n.beginPath(),n.moveTo(55,430),n.lineTo(115,430),n.lineTo(115,205),n.lineTo(165,205),n.lineTo(165,270),n.lineTo(240,165),n.lineTo(165,60),n.lineTo(165,125),n.lineTo(55,125),n.closePath(),n.fill(),n.restore());const s=new Kt(t);return s.colorSpace=lt,s}}class qn{root=new et;penaltyZones=[];bridges=[];trafficLights=[];startSignal=null;wheelTrackCourseSensors=[];update(e,t){for(const n of this.trafficLights)n.update(e,t)}reset(){for(const e of this.trafficLights)e.reset();this.startSignal&&this.startSignal.reset()}addTrafficLight(e,t,n=8,i=0,s={}){const a=new Ln(e,t,n,i,s);return this.trafficLights.push(a),this.root.add(a.root),a}getTrafficLight(e){return this.trafficLights.find(t=>t.markerId===e)}getRoads(){return this._roads}getWindingCourses(){return this._windingCourses}findWindingCourseOf(e){let t=e;for(;t;){if(t instanceof et&&t.name==="winding-course")return this._windingCourses.find(n=>n.course.root===t)??null;t=t.parent}return null}_roads=[];_windingCourses=[];static EDITS_KEY="roadEditor.edits";static loadRoadEdits(){try{const e=localStorage.getItem(this.EDITS_KEY);return e?JSON.parse(e):{}}catch{return{}}}static saveRoadEdits(e){try{localStorage.setItem(this.EDITS_KEY,JSON.stringify(e))}catch{}}persistRoadEdit(e,t,n){const i=qn.loadRoadEdits();i[String(e)]={x:t,z:n},qn.saveRoadEdits(i)}applyPersistedRoadEdits(){const e=qn.loadRoadEdits(),t=Object.entries(e);let n=0;for(const[i,s]of t){const a=parseInt(i,10),o=this._roads[a];if(!o)continue;o.group.position.set(s.x,0,s.z),o.x=s.x,o.z=s.z;const l=o.direction==="vertical"?o.bounds.maxX-o.bounds.minX:o.bounds.maxZ-o.bounds.minZ,c=o.direction==="vertical"?o.bounds.maxZ-o.bounds.minZ:o.bounds.maxX-o.bounds.minX;o.bounds={minX:s.x-(o.direction==="vertical"?l:c)/2,maxX:s.x+(o.direction==="vertical"?l:c)/2,minZ:s.z-(o.direction==="vertical"?c:l)/2,maxZ:s.z+(o.direction==="vertical"?c:l)/2},n++}return n}static WC_EDITS_KEY="windingCourseEditor.edits";static loadWCEdits(){try{const e=localStorage.getItem(this.WC_EDITS_KEY);return e?JSON.parse(e):{}}catch{return{}}}static saveWCEdits(e){try{localStorage.setItem(this.WC_EDITS_KEY,JSON.stringify(e))}catch{}}persistWCEdit(e,t,n){const i=qn.loadWCEdits();i[String(e)]={x:t,z:n},qn.saveWCEdits(i)}applyPersistedWCEdits(){const e=qn.loadWCEdits();let t=0;for(const[n,i]of Object.entries(e)){const s=parseInt(n,10),a=this._windingCourses[s];a&&(a.course.root.position.set(i.x,0,i.z),a.course.root.updateMatrix(),this.rebuildWindingCourseRoads(a),t++)}return t}getSurfaceHeight(e,t){for(const n of this.bridges){const i=n.surfaceHeight(e,t);if(i!==void 0)return i}return .06}addBridge(e,t,n="vertical"){const i=new Gv(e,t,n);return this.bridges.push(i),this.root.add(i.root),i}createArrowTexture(e){const t=document.createElement("canvas");t.width=256,t.height=512;const n=t.getContext("2d");n.clearRect(0,0,t.width,t.height),n.fillStyle="white",n.strokeStyle="white",n.lineWidth=28,n.lineCap="round",n.lineJoin="round";const i=t.width/2;e==="straight"&&(n.beginPath(),n.moveTo(i,420),n.lineTo(i,140),n.stroke(),n.beginPath(),n.moveTo(i,90),n.lineTo(i-55,165),n.lineTo(i-20,165),n.lineTo(i-20,250),n.lineTo(i+20,250),n.lineTo(i+20,165),n.lineTo(i+55,165),n.closePath(),n.fill()),(e==="left"||e==="right")&&(n.save(),e==="left"&&(n.translate(t.width,0),n.scale(-1,1)),n.beginPath(),n.moveTo(55,430),n.lineTo(115,430),n.lineTo(115,205),n.lineTo(165,205),n.lineTo(165,270),n.lineTo(240,165),n.lineTo(165,60),n.lineTo(165,125),n.lineTo(55,125),n.closePath(),n.fill(),n.restore());const s=new Kt(t);return s.colorSpace=lt,s}addRoadArrow(e,t,n,i,s,a){const o=this.createArrowTexture(s),l=new Se(new xt(Math.min(n*.32,s==="straight"?1.2:1.9),Math.min(i*.35,3.4)),new bt({map:o,transparent:!0}));return l.rotation.x=-Math.PI/2,l.position.set(e,.081,t),a.add(l),l}addRoadEdgePattern(e,t,n,i,s,a){const d=Math.ceil(i/.8);for(let f=0;f<d;f++){const u=Math.min(.8,i-f*.8),g=f%2===0?16777215:14170939,_=new Se(new rt(.2,.05,u-0),new ve({color:g,roughness:.85})),p=s==="left"?e-n/2+.2/2:e+n/2-.2/2;_.position.set(p,.08/2+.05/2+.02,t-i/2+f*.8+u/2),_.castShadow=!0,_.receiveShadow=!0,a.add(_)}}centerLineSegments(e,t,n=2){const i=new ve({color:t.startsWith("yellow")?16175948:16777215,roughness:.85}),s=t.endsWith("dashed"),a=[];if(n===1)return{material:i,spans:a};const o=1.5,l=1;if(s)for(let c=0;c<e;c+=o+l)a.push([c,Math.min(c+o,e)]);else a.push([0,e]);return{material:i,spans:a}}addRoad(e,t,n,i,s="vertical",a="straight",o="white-dashed",l=2){const c=new et;c.name="road",c.position.set(e,0,t),c.rotation.y=s==="horizontal"?-Math.PI/2:0,this.root.add(c),this._roads.push({group:c,x:e,z:t,direction:s,bounds:{minX:e-(s==="vertical"?n:i)/2,maxX:e+(s==="vertical"?n:i)/2,minZ:t-(s==="vertical"?i:n)/2,maxZ:t+(s==="vertical"?i:n)/2}});const h=new Se(new rt(n,.08,i),new ve({color:"#2a2a2a",roughness:.95}));h.position.set(0,.02,0),h.name="road-surface",h.receiveShadow=!0,c.add(h),this.addRoadEdgePattern(0,0,n,i,"left",c),this.addRoadEdgePattern(0,0,n,i,"right",c);const{material:d,spans:f}=this.centerLineSegments(i,o,l);for(const[u,g]of f){const _=new Se(new rt(.15,.008,g-u),d);_.position.set(0,.067,-i/2+(u+g)/2),_.receiveShadow=!0,c.add(_)}if(a!=="none")for(const u of l===1?[0]:[-n/4,n/4]){const g=this.addRoadArrow(u,0,n/l,i,a,c);o==="yellow-dashed"&&l===2&&u<0&&g.rotateZ(Math.PI)}return c}connectRoadIntersections(){const e=(n,i)=>Math.min(n.maxX,i.maxX)-Math.max(n.minX,i.minX)>1e-5&&Math.min(n.maxZ,i.maxZ)-Math.max(n.minZ,i.minZ)>1e-5,t=(n,i)=>{if(!e(n,i))return[n];const s=Math.max(n.minX,i.minX),a=Math.min(n.maxX,i.maxX),o=Math.max(n.minZ,i.minZ),l=Math.min(n.maxZ,i.maxZ);return[{...n,maxX:s},{...n,minX:a},{minX:s,maxX:a,minZ:n.minZ,maxZ:o},{minX:s,maxX:a,minZ:l,maxZ:n.maxZ}].filter(c=>c.maxX-c.minX>1e-5&&c.maxZ-c.minZ>1e-5)};for(const[n,i]of this._roads.entries()){const s=this._roads.filter(o=>o!==i&&e(i.bounds,o.bounds)),a=o=>{i.group.updateMatrix();const l=new Be(new E(o.bounds.minX,0,o.bounds.minZ),new E(o.bounds.maxX,0,o.bounds.maxZ)).applyMatrix4(i.group.matrix.clone().invert());return{minX:l.min.x,maxX:l.max.x,minZ:l.min.z,maxZ:l.max.z}};for(const o of[...i.group.children]){if(!(o instanceof Se))continue;const l=s.filter(f=>o.name==="road-surface"?this._roads.indexOf(f)<n:f.direction!==i.direction).map(a);if(!l.length)continue;o.geometry.computeBoundingBox(),o.updateMatrix();const c=o.geometry.boundingBox.clone().applyMatrix4(o.matrix),h={minX:c.min.x,maxX:c.max.x,minZ:c.min.z,maxZ:c.max.z};if(!l.some(f=>e(h,f)))continue;if(o.geometry instanceof xt){i.group.remove(o),o.geometry.dispose();const f=Array.isArray(o.material)?o.material:[o.material];for(const u of f)u instanceof bt&&u.map?.dispose(),u.dispose();continue}let d=[h];for(const f of l)d=d.flatMap(u=>t(u,f));for(const f of d){const u=new Se(new rt(f.maxX-f.minX,c.max.y-c.min.y,f.maxZ-f.minZ),o.material);u.name=o.name,u.position.set((f.minX+f.maxX)/2,o.position.y,(f.minZ+f.maxZ)/2),u.castShadow=o.castShadow,u.receiveShadow=o.receiveShadow,i.group.add(u)}i.group.remove(o),o.geometry.dispose()}}}addRightAngleTurn(e,t,n=8,i="vertical",s="right",a="white-solid",o=2){const l=new et;l.name="right-angle-turn",l.position.set(e,0,t),l.rotation.y=i==="horizontal"?-Math.PI/2:0,l.scale.x=s==="left"?-1:1;const c=new Se(new rt(n,.08,n),new ve({color:"#2a2a2a",roughness:.95}));c.position.y=.02,c.receiveShadow=!0,l.add(c),this.addRoadEdgePattern(0,0,n,n,"left",l);const h=new et;h.rotation.y=-Math.PI/2,l.add(h),this.addRoadEdgePattern(0,0,n,n-.4,"left",h);const d=n/2,{material:f,spans:u}=this.centerLineSegments(n,a,o),g=(_,p,m,w)=>{const S=new Se(new rt(_,.008,p),f);S.position.set(m,.067,w),S.receiveShadow=!0,l.add(S)};for(const[_,p]of u){if(_<d){const m=Math.min(p,d);g(.15,m-_,0,d-(_+m)/2)}if(p>d){const m=Math.max(_,d);g(p-m,.15,(m+p)/2-d,0)}}for(const _ of o===1?[0]:[-n/4,n/4])this.addRoadArrow(_,n/4,n/o,n/2,"right",l);return this.root.add(l),l}addRoadCurve(e,t,n,i,s="white-dashed",a=2){const o=i-n/2,l=i+n/2;if(o<=0)throw new Error("Road curve radius must exceed half its width");const c=Math.PI,h=Math.PI*1.5,d=(p,m,w,S,v,A,R)=>{const P=new Qi;P.absarc(0,0,m,w,S,!1),P.lineTo(p*Math.cos(S),p*Math.sin(S)),P.absarc(0,0,p,S,w,!0),P.closePath();const C=new pi(P,{depth:v,bevelEnabled:!1,curveSegments:64});C.rotateX(Math.PI/2);const M=new Se(C,R);return M.position.set(e,A,t),M.receiveShadow=!0,this.root.add(M),M};d(o,l,c,h,.08,.06,new ve({color:"#2a2a2a",roughness:.95}));const{material:f,spans:u}=this.centerLineSegments(i*(h-c),s,a);for(const[p,m]of u)d(i-.075,i+.075,c+p/i,c+m/i,.008,.071,f);const g=[16777215,14170939].map(p=>new ve({color:p,roughness:.85}));for(const[p,m]of[[o,o+.2],[l-.2,l]]){const w=Math.ceil((h-c)*(p+m)/2/.8);for(let S=0;S<w;S++){const v=c+(h-c)*S/w,A=c+(h-c)*(S+1)/w;d(p,m,v,A,.05,.11,g[S%2]).castShadow=!0}}const _=(c+h)/2;for(const p of a===1?[i]:[i-n/4,i+n/4]){const m=new et;m.position.set(e+p*Math.cos(_),0,t+p*Math.sin(_)),m.rotation.y=-(_-c),this.root.add(m),this.addRoadArrow(0,0,n/a,p*(h-c),"right",m)}}addLine(e,t,n,i,s=15780926,a=!1){const o=new Se(new rt(n,.03,i),new ve({color:s,roughness:.7}));o.position.set(e,.075,t),this.root.add(o),a&&this.penaltyZones.push(new Be().setFromCenterAndSize(new E(e,.5,t),new E(n+.15,1,i+.15)))}addCone(e,t){const n=new Se(new tl(.18,.5,20),new ve({color:16742946}));n.position.set(e,.25,t),n.castShadow=!0,this.root.add(n)}addTriggerZone(e,t,n,i,s=8978312,a=.25){const o=new xt(n,i),l=new bt({color:s,opacity:a,transparent:!0,depthWrite:!1,side:Et}),c=new Se(o,l);return c.rotation.x=-Math.PI/2,c.position.set(e,.075,t),c.receiveShadow=!1,c.castShadow=!1,this.root.add(c),c}addPedestrianCrossing(e,t,n="vertical",i=8,s=3){const a=new et;a.name="pedestrian-crossing",a.position.set(e,0,t),a.rotation.y=n==="horizontal"?-Math.PI/2:0;const o=i-.4,l=new Se(new xt(o,s),new ve({color:"#2a2a2a",roughness:.95}));l.rotation.x=-Math.PI/2,l.position.y=.083,l.receiveShadow=!0,a.add(l);const c=.45,h=.4,d=Math.max(1,Math.floor((o+h)/(c+h))),f=d*c+(d-1)*h,u=new xt(c,s),g=new ve({color:16777215,roughness:.85});for(let _=0;_<d;_++){const p=new Se(u,g);p.rotation.x=-Math.PI/2,p.position.set(-f/2+c/2+_*(c+h),.087,0),p.receiveShadow=!0,a.add(p)}return this.root.add(a),a}addStartLine(e=0,t=-2.5,n="vertical",i=8){const s=document.createElement("canvas");s.width=1536,s.height=512;const a=s.getContext("2d");a.fillStyle="#159447",a.fillRect(0,0,s.width,s.height),a.fillStyle="#ffffff",a.fillRect(0,0,s.width,28),a.fillRect(0,s.height-28,s.width,28),a.font="bold 190px Arial, sans-serif",a.textAlign="center",a.textBaseline="middle",a.fillText("Xuất phát",s.width/2,s.height/2,s.width-120);const o=new Kt(s);o.colorSpace=lt;const l=new Se(new xt(i-.2,2.6),new ve({map:o,roughness:.85}));return l.rotation.x=-Math.PI/2,l.rotateOnWorldAxis(new E(0,1,0),n==="horizontal"?-Math.PI/2:0),l.position.set(e,.095,t),l.receiveShadow=!0,l.name="START_LINE",this.root.add(l),l}addWheelTrackCourse({x:e=58,z:t=-20,direction:n="vertical",entryLength:i=13.2}={}){const s=new Yv(0,0,i),a=new He().makeTranslation(e,0,t).multiply(new He().makeRotationY(n==="horizontal"?Math.PI/2:0));s.root.applyMatrix4(a),this.root.add(s.root);for(const _ of s.penaltyZones)this.penaltyZones.push(_.clone().applyMatrix4(a));const o=new E(e,0,t),c=new E(-s.Lv,0,-i+s.Bv/2-s.Sv).applyMatrix4(a),h=n==="horizontal"?new E(1,0,0):new E(0,0,1),d=s.startYellowSensorLocal.clone().applyMatrix4(a),f=s.endYellowSensorLocal.clone().applyMatrix4(a),u=s.wheelTrackZoneLocal.clone().applyMatrix4(a),g=s.boundarySensorsLocal.map(_=>_.clone().applyMatrix4(a));return{entryWorld:o,exitWorld:c,exitForwardAxis:h,startYellowLine:s.startYellowLine,endYellowLine:s.endYellowLine,startYellowSensor:d,endYellowSensor:f,wheelTrackZone:u,boundarySensors:g}}addWindingCourse({x:e,z:t,entryLength:n=30,exitLength:i=6}){const s=new qv(0,0),a=t+Math.min(7,n/2),o=this._roads.length;this.addRoad(e,t+n/2,s.width,n,"vertical","none","white-solid",1);const l=this.addRoadArrow(e,a,s.width,6,"straight",this.root).rotateZ(Math.PI);s.root.position.set(e,0,t+n),s.root.rotation.y=Math.PI/2,s.root.updateMatrix(),this.root.add(s.root);const c=this.penaltyZones.length,h={course:s,entryRoadIndex:0,exitRoadIndex:0,entryArrow:null,exitArrow:null,sign:null,_entryLength:n,_exitLength:i};for(const p of s.penaltyZones){const m=p.clone().applyMatrix4(s.root.matrix);m._wce=h,this.penaltyZones.push(m)}const d=s.exit.clone().applyMatrix4(s.root.matrix),f=this._roads.length;this.addRoad(d.x,d.z+i/2,s.width,i,"vertical","none","white-solid",1);const u=this.addRoadArrow(d.x,d.z+i/2,s.width,i,"straight",this.root).rotateZ(Math.PI),g=new Jc({title:`QUA ĐƯỜNG
VÒNG QUANH CO`,subtitle:"Đi chậm, giữ bánh xe trong vạch giới hạn",x:e+4,z:a,rotation:Math.PI}).root;this.root.add(g);const _={course:s,entryRoadIndex:o,exitRoadIndex:f,entryArrow:l,exitArrow:u,sign:g,_entryLength:n,_exitLength:i};for(let p=c;p<this.penaltyZones.length;p++)this.penaltyZones[p]._wce=_;this._windingCourses.push(_)}rebuildWindingCourseRoads(e){const{course:t,entryRoadIndex:n,exitRoadIndex:i,entryArrow:s,exitArrow:a,sign:o,_entryLength:l,_exitLength:c}=e;for(const R of[i,n]){const P=this._roads[R];P&&(this.root.remove(P.group),this._roads.splice(R,1))}this.root.remove(s),this.root.remove(a),this.root.remove(o);const h=new E(0,0,-l/2);h.applyMatrix4(t.root.matrix);const d=h.x,f=h.z,u=f+Math.min(7,l/2),g=this.addRoadArrow(d,u,t.width,6,"straight",this.root);g.rotateZ(Math.PI),e.entryArrow=g;const _=t.exit.clone().applyMatrix4(t.root.matrix),p=_.x,m=_.z,w=this.addRoadArrow(p,m+c/2,t.width,c,"straight",this.root).rotateZ(Math.PI);e.exitArrow=w;const S=this._roads.length;this.addRoad(d,f,t.width,l,"vertical","none","white-solid",1);const v=this._roads.length;this.addRoad(p,m+c/2,t.width,c,"vertical","none","white-solid",1);const A=new Jc({title:`QUA ĐƯỜNG
VÒNG QUANH CO`,subtitle:"Đi chậm, giữ bánh xe trong vạch giới hạn",x:d+4,z:u,rotation:Math.PI}).root;this.root.add(A),this.root.remove(e.sign),e.sign=A,e.entryRoadIndex=S,e.exitRoadIndex=v;for(let R=this.penaltyZones.length-1;R>=0;R--)this.penaltyZones[R]._wce===e&&this.penaltyZones.splice(R,1);for(const R of t.penaltyZones){const P=R.clone().applyMatrix4(t.root.matrix);P._wce=e,this.penaltyZones.push(P)}}addStartZone(e,t,n="horizontal",i=8,s={}){const a=new et;a.name="ZONE_01_START",this.root.add(a);const o=this.addStartLine(e,t,n,i),l=this.root.children[this.root.children.length-1];l&&l.name==="START_LINE"&&(l.name="EX01_START_LINE"),a.attach(o);const c=this.addRoadText("XUẤT PHÁT",e,t,n,i);if(c.name="EX01_START_TEXT",a.attach(c),s.withSignal){const _=s.signalRotation??Lt.heading,p=this.addTrafficLight(e,t,i,_,{markerId:"START"});p.root.name="START_SIGNAL",this.startSignal=p,a.attach(p.root)}else this.startSignal=null;const h=i/2,d=new Be(new E(e-4,-1,t-h),new E(e-.15,3,t+h)),f=new Be(new E(e-.15,-1,t-h),new E(e+.15,3,t+h)),u=e+5,g=new Be(new E(u-.4,-1,t-h),new E(u+.4,3,t+h));return a.userData={sensors:{waitZone:d,startTrigger:f,signalOffGate:g},metadata:{lineX:e,lineZ:t,direction:n,roadWidth:i,markerId:"1A"}},a}addRoadText(e,t,n,i,s=8){const a=document.createElement("canvas");a.width=1024,a.height=256;const o=a.getContext("2d");o.fillStyle="rgba(0,0,0,0)",o.fillRect(0,0,a.width,a.height),o.fillStyle="#f5f5f5",o.font='bold 168px "Arial", sans-serif',o.textAlign="center",o.textBaseline="middle",o.fillText(e,a.width/2,a.height/2);const l=new Kt(a);l.colorSpace=lt,l.anisotropy=4;const c=Math.max(2,s-.4),h=new Se(new xt(c,c/4),new ve({map:l,transparent:!0,roughness:.95,depthWrite:!1}));return h.rotation.x=-Math.PI/2,h.rotateOnWorldAxis(new E(0,1,0),i==="horizontal"?-Math.PI/2:0),h.position.set(t,.012,n),h.receiveShadow=!0,h}addPedestrianStopLine(e,t=8,n=0){const i=new Se(new rt(.2,.01,t),new ve({color:16777215,roughness:.85}));return i.position.set(n,.085,e),i.receiveShadow=!0,i.name="EX02_STOP_LINE",this.root.add(i),i}addStopBarWarning(e,t,n=8){const i=new Se(new rt(.2,.01,n),new ve({color:16777215,roughness:.85}));return i.position.set(e,.085,t),i.receiveShadow=!0,i.name="EX02_STOP_BAR_WARNING",this.root.add(i),i}addStopSign(e){this.root.add(new Dr(e).root)}addPedestrianSign(e){this.root.add(new Wv(e).root)}async loadStopSignGLB(){return Dr.preload()}addPedestrianZone(e){const t=e.roadWidth??8,n=e.direction??"horizontal",i=e.stopLineX,s=e.crosswalkX,a=e.roadZ,o=new et;o.name="ZONE_02_PEDESTRIAN",this.root.add(o);const l=this.addPedestrianStopLine(a,t,-7.5);o.attach(l);let c=this.root.children.find(L=>L.name==="pedestrian-crossing");c||(c=this.addPedestrianCrossing(s,a,n,t,3)),c.name="EX02_CROSSWALK",o.attach(c);const h=new Dr({x:i,z:a,roadWidth:t,scale:.012});o.attach(h.root);const d=t/2,f=new Se(new rt(t,.008,.05),new ve({color:16175948,roughness:.85}));f.position.set(i+.5,.07,a),f.receiveShadow=!0,f.name="EX02_REFERENCE_0_5M",o.add(f);const u=this.makeGroundLabel("0.5 m",i+.5,a+t/2+.4,t,.55);u.name="EX02_REFERENCE_0_5M_TEXT",o.add(u);const g=this.makeStopDistanceSprite();g.visible=!1,g.name="EX02_LIVE_DISTANCE_LABEL",o.add(g);const _=i-15,p=new Be(new E(a-d,-1,_),new E(a+d,3,i)),m=new Be(new E(a-d,-1,i-.15),new E(a+d,3,i+.15)),w=new Be(new E(a-d,-1,i+.15),new E(a+d,3,i+1)),S=i+3,v=new Be(new E(a-d,-1,S-.4),new E(a+d,3,S+.4)),A=.4,R=.25,P=i-16,C=i+4,M=new Be(new E(a-d-A,-1,P),new E(a-d,R,C)),y=new Be(new E(a+d,-1,P),new E(a+d+A,R,C));return o.userData={sensors:{approachZone:p,stopLine:m,overLine:w,exitSensor:v,curbCollider:[M,y]},metadata:{stopLineX:i,crosswalkX:s,roadZ:a,roadWidth:t,direction:n,markerId:"2A"},handle:{updateLabel:(L,U,B)=>this.updateStopDistanceLabel(g,L,U,B)}},o}makeStopDistanceSprite(){const e=document.createElement("canvas");e.width=512,e.height=192;const t=new zu(new Rh({map:new Kt(e),transparent:!0,depthTest:!1,depthWrite:!1}));return t.scale.set(4,1.5,1),t.renderOrder=999,t}updateStopDistanceLabel(e,t,n,i){if(n==="HIDDEN"){e.visible=!1;return}e.visible=!0,e.position.set(i+6,1.8,0);const s=e.material,a=s.map.image,o=a.getContext("2d");o.clearRect(0,0,a.width,a.height);const l={VALID:"#36c66a",TOO_EARLY:"#f6d34c",OVER:"#e15252",APPROACHING:"#5b9bdb"},c={VALID:"VỊ TRÍ HỢP LỆ",TOO_EARLY:"DỪNG QUÁ XA",OVER:"ĐÃ VƯỢT VẠCH",APPROACHING:"ĐANG TIẾP CẬN"};o.fillStyle="rgba(8, 14, 22, .78)",jc(o,0,0,a.width,a.height,18),o.fill(),o.strokeStyle=l[n],o.lineWidth=6,jc(o,3,3,a.width-6,a.height-6,15),o.stroke(),o.fillStyle=l[n],o.font="bold 60px Arial",o.textAlign="center",o.textBaseline="middle",o.fillText(`A = ${t.toFixed(2)} m`,a.width/2,a.height/2-8),o.font="28px Arial",o.fillText(c[n],a.width/2,a.height/2+50),s.map.needsUpdate=!0}setStopDistanceLabel(e,t,n){const i=this.root.children.find(s=>s.name==="ZONE_02_PEDESTRIAN");return!i||!i.userData?.handle?!1:(i.userData.handle.updateLabel(e,t,n),!0)}makeGroundLabel(e,t,n,i,s){const a=document.createElement("canvas");a.width=512,a.height=128;const o=a.getContext("2d");o.clearRect(0,0,a.width,a.height),o.fillStyle="#f6d34c",o.font="bold 72px Arial",o.textAlign="center",o.textBaseline="middle",o.fillText(e,a.width/2,a.height/2);const l=new Kt(a);l.colorSpace=lt;const c=a.width/a.height,h=new Se(new xt(s*c,s),new ve({map:l,transparent:!0,roughness:.95,depthWrite:!1}));return h.rotation.x=-Math.PI/2,h.rotateOnWorldAxis(new E(0,1,0),-Math.PI/2),h.position.set(t,.012,n+i/4),h.receiveShadow=!0,h}}function jc(r,e,t,n,i,s){r.beginPath(),r.moveTo(e+s,t),r.arcTo(e+n,t,e+n,t+i,s),r.arcTo(e+n,t+i,e,t+i,s),r.arcTo(e,t+i,e,t,s),r.arcTo(e,t,e+n,t,s),r.closePath()}function Kv(r){const e=new Se(new xt(300,300),new ve({color:6517594,roughness:1}));e.rotation.x=-Math.PI/2,e.receiveShadow=!0,r.root.add(e),r.addRoad(0,-2,8,20,"horizontal","straight","white-dashed"),r.addStartZone(Lt.lineX,Lt.lineZ,"horizontal",8),r.addRoad(-35,-2,8,60,"horizontal","straight","white-dashed"),r.addRoad(8,-2,8,20,"horizontal","straight","white-dashed");const t=-5,n=-7;r.addPedestrianCrossing(t,-2,"horizontal",8,3),r.addPedestrianZone({stopLineX:n,crosswalkX:t,roadZ:Lt.lineZ,roadWidth:8,direction:"horizontal"});const i=25.5,s=i+3,a=new Se(new rt(8,.008,.05),new ve({color:16175948,roughness:.85}));a.position.set(i-.5,.07,Lt.lineZ),a.receiveShadow=!0,a.name="EX03_REFERENCE_0_5M",r.root.add(a);const o=r.makeGroundLabel("0.5 m",i-.5,Lt.lineZ+4,8,.55);o.name="EX03_REFERENCE_0_5M_TEXT",r.root.add(o);const l=new et;l.name="ZONE_03_HILL",r.root.add(l);const c=8/2,h=Lt.lineZ,d=new Be(new E(i-.15,-1,h-c),new E(i+.15,3,h+c)),f=new Be(new E(i+.15,-1,h-c),new E(i+1,3,h+c)),u=new Be(new E(s-.4,-1,h-c),new E(s+.4,3,h+c)),g=i-15,_=new Be(new E(g,-1,h-c),new E(i+.15,3,h+c));l.userData={sensors:{stopLine:d,overLine:f,exitSensor:u,approachSensor:_},metadata:{stopLineX:i,exitX:s,roadZ:h,roadWidth:8,direction:"horizontal",markerId:"3A"}},r.addBridge(31,-2,"horizontal"),r.addRoad(49,-2,8,20,"horizontal","straight","white-solid"),r.addRoad(69,-2,8,20,"horizontal","straight","white-solid"),r.addRightAngleTurn(79,-2,8,"horizontal","left","white-solid"),r.addRoad(79,-8,8,6,"vertical","straight","white-dashed"),r.addRoad(79,-15,8,10,"vertical","straight","white-dashed");const p=2.2*2,m=1.5*4.4,w=p+.44;r.addRoad(79,-27,8,14,"vertical","straight","white-dashed");for(let S=0;S<4;S++){const v=-18-S*w,A=10.8+S*w,R=r.addWheelTrackCourse({x:73,z:v,direction:"horizontal",entryLength:A});r.wheelTrackCourseSensors.push(R),r.addRoad(76,v,p,m,"horizontal","none","white-solid",1),r.addRoad(R.exitWorld.x-10,R.exitWorld.z,p,m+18,"horizontal","none","white-solid",1)}r.addRoad(25,-18.85,p,2,"horizontal","none","white-solid",1),r.addRoad(27,-14.05,p,7,"horizontal","none","white-solid",1),r.addRoad(30,-9.25,p,12,"horizontal","none","white-solid",1),r.addRoad(21,-24,8,36,"vertical","straight","yellow-dashed"),r.addPedestrianCrossing(21,-36,"vertical",8,3),r.addRoad(34,-42,8,26,"horizontal","straight","yellow-dashed"),r.addPedestrianCrossing(27,-42,"horizontal",8,3),r.addPedestrianCrossing(15,-42,"horizontal",8,3),r.addRoad(8,-42,8,26,"horizontal","straight","yellow-dashed"),r.addRoad(21,-50,8,10,"vertical","straight","yellow-dashed"),r.addPedestrianCrossing(21,-48,"vertical",8,3);for(const[S,v,A,R,P,C,M,y,L]of[[30,-36,0,6,-7,7,,2,"SOUTH"],[12,-47,Math.PI,7,-7,7,,2,"NORTH"],[16,-42,Math.PI/2,-6,-2,-10,-6,2,"WEST"],[26,-42,-Math.PI/2,-4,-2,-10,-6,2,"EAST"]])r.addTrafficLight(S,v,8,A,{stopLineZ:R,stopLineX:P,triggerStart:C,triggerStartX:M,triggerLength:y,markerId:L});r.addTriggerZone(23,-45,4,6),r.addRoad(21,-60,8,30,"vertical","straight","yellow-dashed"),r.addRoad(21,-70,8,20,"vertical","straight","yellow-dashed"),r.addRightAngleTurn(21,-84,8,"vertical","right","yellow-dashed"),r.addRoad(35,-84,8,20,"horizontal","straight","yellow-dashed"),r.addWindingCourse({x:41,z:-84,entryLength:30}),r.addRoad(55,-84,8,26,"horizontal","straight","yellow-dashed"),r.addWindingCourse({x:51,z:-84,entryLength:15}),r.addRoad(67,-84,8,14,"horizontal","straight","yellow-dashed"),r.addWindingCourse({x:61,z:-84,entryLength:30}),r.addWindingCourse({x:71,z:-84,entryLength:15})}class Zv extends qn{constructor(){super(),Kv(this),this.applyPersistedRoadEdits(),this.applyPersistedWCEdits(),this.connectRoadIntersections()}}const $v="B",$t=$v,Jv={A1:40,A2:50,B:24,C1:20,C:20,D1:24,D2:24,D:20,E:20,Fc:20},Vs={A1:5,A2:5,B:5,C1:5,C:5,D1:5,D2:5,D:5,E:5,Fc:5},Gs={A1:5,A2:5,B:5,C1:5,C:5,D1:5,D2:5,D:5,E:5,Fc:5},jv={A1:3,A2:3,B:3,C1:3,C:3,D1:3,D2:3,D:3,E:3,Fc:3},Qv={A1:1,A2:1,B:1,C1:1,C:1,D1:1,D2:1,D:1,E:1,Fc:1},ex={maxSpeedKmh:Jv,engine:{stallPenalty:Vs,rpmExceededPenalty:Gs,maxRPM:4e3},speeding:{intervalSec:jv,penaltyPerInterval:Qv},signalOffDistanceM:5,penalties:{noSeatbelt:5,noLeftSignalAtStart:5,leftSignalNotOffAt5m:5,leftSignalTiming:5},startTimeout:{penaltyAtSec:20,penaltyPoints:5,disqualifyAtSec:30}},tx={stopPosition:{maxDistanceBeforeLineM:.5},engine:{maxRPM:4e3,stallPenalty:Vs,rpmExceededPenalty:Gs},maxSpeedKmh:{A1:40,A2:50,B:24,D1:24,D2:24,C1:20,C:20,D:20,E:20,Fc:20},penalties:{noRequiredStop:5,stopTooEarly:5,stopOverLine:5},speeding:{intervalSec:3,penaltyPerInterval:1}},Qc={stopPosition:{maxDistanceBeforeLineM:.5},hillStart:{maxRollbackM:.5,mustCrossStopPositionWithinSec:30},engine:{maxRPM:4e3,stallPenalty:Vs,rpmExceededPenalty:Gs},maxSpeedKmh:{A1:40,A2:50,B:24,D1:24,D2:24,C1:20,C:20,D:20,E:20,Fc:20},penalties:{stopTooEarly:5},speeding:{intervalSec:3,penaltyPerInterval:1}};function nx(r){const e=ex;return{maxSpeedKmh:e.maxSpeedKmh[r],engine:{stallPenalty:e.engine.stallPenalty[r],rpmExceededPenalty:e.engine.rpmExceededPenalty[r],maxRPM:e.engine.maxRPM},speeding:{intervalSec:e.speeding.intervalSec[r],penaltyPerInterval:e.speeding.penaltyPerInterval[r]},signalOffDistanceM:e.signalOffDistanceM,penalties:{...e.penalties},startTimeout:{...e.startTimeout},vehicleClass:r}}const ix={time:{limitSec:120,overtimeIntervalSec:120,overtimePenalty:5},wheelTrack:{missingWheelPenalty:5,overlapContactPenalty:5,overlapSustainedIntervalSec:5,overlapSustainedPenalty:5},boundary:{contactPenalty:5,sustainedContactIntervalSec:5,sustainedContactPenalty:5},engine:{maxRPM:4e3,stallPenalty:Vs,rpmExceededPenalty:Gs},maxSpeedKmh:{A1:40,A2:50,B:24,D1:24,D2:24,C1:20,C:20,D:20,E:20,Fc:20},speeding:{intervalSec:3,penaltyPerInterval:1}},sx={id:"EXAM_05_SIGNALIZED_INTERSECTION",stopPosition:{procedureMaxM:.5,requirementMaxM:1,verifiedMaxM:null},timer:{penaltyAtSec:20,penaltyPoints:5,disqualifyAtSec:30},penalties:{redLight:10,stopOverLine:5,stopTooEarly:5,engineStall:5},engine:{maxRPM:4e3,stallPenalty:Vs,rpmExceededPenalty:Gs},maxSpeedKmh:{A1:40,A2:50,B:24,D1:24,D2:24,C1:20,C:20,D:20,E:20,Fc:20},speeding:{intervalSec:3,penaltyPerInterval:1},disqualify:{timeout30s:!0}};function eh(r){const e=sx,t=e.stopPosition.verifiedMaxM??e.stopPosition.procedureMaxM;return{id:e.id,stopPosition:{procedureMaxM:e.stopPosition.procedureMaxM,requirementMaxM:e.stopPosition.requirementMaxM,verifiedMaxM:e.stopPosition.verifiedMaxM,effectiveMaxM:t},timer:{...e.timer},penalties:{...e.penalties},maxSpeedKmh:e.maxSpeedKmh[r],engine:{stallPenalty:e.engine.stallPenalty[r],rpmExceededPenalty:e.engine.rpmExceededPenalty[r],maxRPM:e.engine.maxRPM},speeding:{...e.speeding},disqualify:{...e.disqualify},vehicleClass:r}}const Ui=8,Ua=1.3,rx=5;class ax{id="EXAM_01_START";state="PRE_START";waitZone;startTrigger;signalOffGate;vehicleClass;startLampOn=!1;lineX;signalOffX;rules=nx($t);commandAt=0;countdownAt=0;penalty20sApplied=!1;crossedChecked=!1;timingPenaltyApplied=!1;stallLatched=!1;rpmLatched=!1;speedingSec=0;engineWasRunning=!1;stopDwell=0;waitToastAt=-1/0;countdownToastEmitted=!1;prevFrontX=0;signalOffChecked=!1;constructor(e={}){this.vehicleClass=e.vehicleClass??$t,this.lineX=e.lineX??Lt.lineX,this.signalOffX=this.lineX+this.rules.signalOffDistanceM;const t=e.lineZ??Lt.lineZ;this.waitZone=new Be(new E(this.lineX-4,-1,t-Ui/2),new E(this.lineX-Ua,3,t+Ui/2)),this.startTrigger=new Be(new E(this.lineX-Ua,-1,t-Ui/2),new E(this.lineX+Ua,3,t+Ui/2)),this.signalOffGate=new Be(new E(this.signalOffX-.4,-1,t-Ui/2),new E(this.signalOffX+.4,3,t+Ui/2)),this.prevFrontX=this.lineX-Lt.distance}get title(){switch(this.state){case"PRE_START":return"Chuẩn bị";case"COUNTDOWN_5S":return"Xuất phát · Chuẩn bị xuất phát";case"WAITING_FOR_START_COMMAND":return"Xuất phát · Chờ hiệu lệnh";case"WAITING_FOR_GO":return"Xuất phát · Chờ tín hiệu xanh";case"COMMAND_RECEIVED":return"Xuất phát · Được phép xuất phát";case"STARTING":return"Xuất phát · Đang khởi hành";case"START_LINE_CROSSED":return"Xuất phát · Tắt xi nhan trái sau 5 m";case"SIGNAL_OFF_ZONE":return"Xuất phát · Tắt xi nhan trái sau 5 m";case"EXAM_01_COMPLETED":return"Xuất phát";case"DISQUALIFIED":return"Xuất phát · Đình chỉ"}}reset(){this.state="PRE_START",this.startLampOn=!1,this.commandAt=0,this.countdownAt=0,this.penalty20sApplied=!1,this.crossedChecked=!1,this.timingPenaltyApplied=!1,this.stallLatched=!1,this.rpmLatched=!1,this.speedingSec=0,this.engineWasRunning=!1,this.stopDwell=0,this.waitToastAt=-1/0,this.countdownToastEmitted=!1,this.signalOffChecked=!1,this.prevFrontX=this.lineX-Lt.distance}update(e){const t=[],n=performance.now(),i=(l,c)=>{t.push({at:n,points:l,reason:c})},s=e.frontPosition.x,a=this.prevFrontX<this.lineX&&s>=this.lineX,o=this.prevFrontX<this.signalOffX&&s>=this.signalOffX;if(this.prevFrontX=s,this.state==="EXAM_01_COMPLETED"||this.state==="DISQUALIFIED")return{penalties:t,completed:this.state==="EXAM_01_COMPLETED",disqualified:this.state==="DISQUALIFIED"};if(this.state==="PRE_START")return this.updateApproach(e);if(this.state==="COUNTDOWN_5S"){const l=this.waitZone.containsPoint(e.position)&&e.position.x<this.lineX-.15,c=Math.abs(e.speedKmh)<.6;return!e.engineRunning||!l||!c?(this.state="PRE_START",this.stopDwell=0,this.countdownAt=0,this.countdownToastEmitted=!1,{penalties:t,completed:!1,disqualified:!1}):(this.countdownAt===0&&(this.countdownAt=n),(n-this.countdownAt)/1e3>=rx?(this.state="COMMAND_RECEIVED",this.commandAt=n,this.startLampOn=!0,{toast:"Bắt đầu thi",penalties:[],completed:!1,disqualified:!1}):this.countdownToastEmitted?{penalties:t,completed:!1,disqualified:!1}:(this.countdownToastEmitted=!0,{toast:"Chuẩn bị xuất phát",penalties:[],completed:!1,disqualified:!1}))}if(this.checkEngineAndSpeed(e,i),this.state==="COMMAND_RECEIVED"||this.state==="STARTING"){const l=(n-this.commandAt)/1e3;if(a)return this.markCrossed(e,i),this.state="START_LINE_CROSSED",{toast:"Lệnh xuất phát",penalties:t,completed:!1,disqualified:!1};if(l>=this.rules.startTimeout.disqualifyAtSec){this.state="DISQUALIFIED",this.startLampOn=!1;const c=`Quá ${this.rules.startTimeout.disqualifyAtSec}s chưa qua vạch xuất phát`;return{toast:`Đình chỉ sát hạch — ${c}`,penalties:[],completed:!1,disqualified:!0,disqualifyReason:c}}return!this.penalty20sApplied&&l>=this.rules.startTimeout.penaltyAtSec&&(this.penalty20sApplied=!0,i(this.rules.startTimeout.penaltyPoints,`Quá ${this.rules.startTimeout.penaltyAtSec}s chưa qua vạch xuất phát`)),{penalties:t,completed:!1,disqualified:!1}}if(this.state==="START_LINE_CROSSED")return this.state="SIGNAL_OFF_ZONE",{penalties:t,completed:!1,disqualified:!1};if(this.state==="SIGNAL_OFF_ZONE"){const l=this.checkSignalOff(e,o,i);return this.signalOffGate.containsPoint(e.frontPosition)&&!this.signalOffChecked&&(this.signalOffChecked=!0),this.signalOffChecked&&e.leftSignal===!1?(this.state="EXAM_01_COMPLETED",this.startLampOn=!1,{toast:l??"Hoàn thành bài 1",penalties:t,completed:!0,disqualified:!1}):s>=this.signalOffX+2?(this.state="EXAM_01_COMPLETED",this.startLampOn=!1,{toast:"Hoàn thành bài 1",penalties:t,completed:!0,disqualified:!1}):{toast:l,penalties:t,completed:!1,disqualified:!1}}return{penalties:t,completed:!1,disqualified:!1}}updateApproach(e){const t=e.engineRunning&&!this.engineWasRunning;if(this.engineWasRunning=e.engineRunning,t)return{toast:"Chào mừng bạn đến với bài thi sát hạch, đưa xe đến vạch xuất phát.",penalties:[],completed:!1,disqualified:!1};const n=this.waitZone.containsPoint(e.position)&&e.position.x<this.lineX-.15,i=Math.abs(e.speedKmh)<.6;if(e.engineRunning&&n&&i){if(this.stopDwell+=e.dt,this.stopDwell>=.4)return this.state="COUNTDOWN_5S",this.countdownAt=0,{penalties:[],completed:!1,disqualified:!1}}else this.stopDwell=0;return{penalties:[],completed:!1,disqualified:!1}}markCrossed(e,t){this.crossedChecked||(this.crossedChecked=!0,e.seatBeltFastened||t(this.rules.penalties.noSeatbelt,"Không thắt dây an toàn khi xuất phát"),e.leftSignal||t(this.rules.penalties.noLeftSignalAtStart,"Không bật xi nhan trái khi xuất phát"))}checkSignalOff(e,t,n){t&&e.leftSignal&&n(this.rules.penalties.leftSignalNotOffAt5m,"Không tắt xi nhan trái tại mốc 5 m"),this.signalOffChecked&&e.leftSignal&&!this.timingPenaltyApplied&&(this.timingPenaltyApplied=!0,n(this.rules.penalties.leftSignalTiming,"Xi nhan trái không tắt kịp thời sau mốc 5 m"))}checkEngineAndSpeed(e,t){if(e.stalled&&!this.stallLatched&&(this.stallLatched=!0,t(this.rules.engine.stallPenalty,"Chết máy")),e.stalled||(this.stallLatched=!1),e.rpm>this.rules.engine.maxRPM&&!this.rpmLatched&&(this.rpmLatched=!0,t(this.rules.engine.rpmExceededPenalty,`Vượt ${this.rules.engine.maxRPM} vòng/phút`)),e.rpm<=this.rules.engine.maxRPM&&(this.rpmLatched=!1),e.speedKmh>this.rules.maxSpeedKmh)for(this.speedingSec+=e.dt;this.speedingSec>=this.rules.speeding.intervalSec;)this.speedingSec-=this.rules.speeding.intervalSec,t(this.rules.speeding.penaltyPerInterval,"Vượt tốc độ quy định");else this.speedingSec=0}}const ox={approachZoneM:15,exitDistanceM:3,stopSpeedKmh:.6,minStopDwellSec:.3};class lx{id="EXAM_02_PEDESTRIAN";state="INACTIVE";startLampOn=!1;stopLineX;exitX;approachEntryX;stopLine;approachZone;maxDistanceBeforeLineM;maxSpeedKmh;maxRPM;stallPenalty;rpmExceededPenalty;noRequiredStopPenalty;stopTooEarlyPenalty;stopOverLinePenalty;speedingIntervalSec;speedingPenaltyPerInterval;stopSpeedKmh;minStopDwellSec;stoppedSince=0;activatedAt=0;stopEvaluated=!1;rpmViolationLatched=!1;speedingSec=0;arrivalOvertimeSec=0;engineWasRunning=!1;stallLatched=!1;stallEventCount=0;_stopClassification;constructor(e){const t={...ox,...e};this.stopLineX=t.stopLineX,this.stopSpeedKmh=t.stopSpeedKmh,this.minStopDwellSec=t.minStopDwellSec,this.exitX=t.stopLineX+t.exitDistanceM,this.approachEntryX=t.stopLineX-t.approachZoneM;const n=tx;this.maxDistanceBeforeLineM=n.stopPosition.maxDistanceBeforeLineM,this.maxRPM=n.engine.maxRPM,this.stallPenalty=n.engine.stallPenalty[$t],this.rpmExceededPenalty=n.engine.rpmExceededPenalty[$t],this.noRequiredStopPenalty=n.penalties.noRequiredStop,this.stopTooEarlyPenalty=n.penalties.stopTooEarly,this.stopOverLinePenalty=n.penalties.stopOverLine,this.speedingIntervalSec=n.speeding.intervalSec,this.speedingPenaltyPerInterval=n.speeding.penaltyPerInterval,this.maxSpeedKmh=n.maxSpeedKmh[$t];const i=t.roadWidth/2,s=t.roadZ,a=t.stopLineX-.15,o=t.stopLineX+.15;this.stopLine=new Be(new E(s-i,-1,a),new E(s+i,3,o));const l=t.stopLineX-t.approachZoneM;this.approachZone=new Be(new E(s-i,-1,l),new E(s+i,3,o))}get title(){switch(this.state){case"INACTIVE":return"Bài 2 · Nhường đường người đi bộ";case"APPROACHING":return"Bài 2 · Giảm tốc trước vạch";case"STOP_EVALUATION":return"Bài 2 · Dừng chờ";case"COMPLETED":return"Bài 2";case"DISQUALIFIED":return"Bài 2 · Đình chỉ"}}get stopClassification(){return this._stopClassification}reset(){this.state="INACTIVE",this.startLampOn=!1,this.stoppedSince=0,this.activatedAt=0,this.stopEvaluated=!1,this.rpmViolationLatched=!1,this.speedingSec=0,this.arrivalOvertimeSec=0,this.engineWasRunning=!1,this.stallLatched=!1,this.stallEventCount=0,this._stopClassification=void 0}activate(){this.state="APPROACHING",this.startLampOn=!1,this.activatedAt=performance.now()}signedDistanceToStopLine(e){return this.stopLineX-e.x}isInApproachZone(e){const t=e.x;return t>=this.approachEntryX&&t<=this.stopLineX}hasCrossedStopLine(e){return e.x>=this.stopLineX}hasPassedExit(e){return e.x>=this.exitX}update(e){if(this.state==="INACTIVE"||this.state==="COMPLETED"||this.state==="DISQUALIFIED")return{penalties:[],completed:this.state==="COMPLETED",disqualified:this.state==="DISQUALIFIED"};const t=[],n=performance.now(),i=(a,o)=>{t.push({at:n,points:a,reason:o})};e.frontPosition.x;const s=Math.abs(e.speedKmh)<this.stopSpeedKmh;if(e.position.y>.25)return this.state="DISQUALIFIED",this.startLampOn=!1,{toast:"Đình chỉ sát hạch — Lái xe lên vỉa hè",penalties:[],completed:!1,disqualified:!0,disqualifyReason:"Lái xe lên vỉa hè"};if(e.engineRunning&&!this.engineWasRunning&&(this.stallLatched=!1),this.engineWasRunning=e.engineRunning,!e.engineRunning&&!this.stallLatched&&e.clutch<.5&&this.state==="APPROACHING"&&(this.stallLatched=!0,this.stallEventCount+=1,i(this.stallPenalty,"Chết máy")),e.rpm>this.maxRPM&&!this.rpmViolationLatched?(this.rpmViolationLatched=!0,i(this.rpmExceededPenalty,`Vòng tua máy vượt ${this.maxRPM} vòng/phút`)):e.rpm<=this.maxRPM*.95&&(this.rpmViolationLatched=!1),e.speedKmh>this.maxSpeedKmh?(this.speedingSec+=e.dt,this.speedingSec>=this.speedingIntervalSec&&(this.speedingSec=0,i(this.speedingPenaltyPerInterval,`Vượt tốc độ quy định (${this.maxSpeedKmh} km/h)`))):this.speedingSec=0,this.state==="APPROACHING"&&(this.arrivalOvertimeSec+=e.dt),this.state==="APPROACHING"){if(this.hasCrossedStopLine(e.frontPosition))return this.stopEvaluated||(this.stopEvaluated=!0,this._stopClassification="NO_REQUIRED_STOP",i(this.noRequiredStopPenalty,"Không dừng xe ở vạch dừng quy định")),this.state="STOP_EVALUATION",{toast:"Đã qua vạch dừng",penalties:t,completed:!1,disqualified:!1,stopClassification:this.stopClassification};const a=this.signedDistanceToStopLine(e.frontPosition);if(a>-.15&&a<2&&s){if(this.stoppedSince===0&&(this.stoppedSince=n),(n-this.stoppedSince)/1e3>=this.minStopDwellSec&&!this.stopEvaluated)return this.stopEvaluated=!0,this.evaluateStop(a,i),this.state="STOP_EVALUATION",{toast:this.stopClassification==="VALID_STOP"?"Dừng đúng vị trí":"Đánh giá vị trí dừng",penalties:t,completed:!1,disqualified:!1,stopClassification:this.stopClassification}}else this.stoppedSince=0;return{penalties:t,completed:!1,disqualified:!1}}return this.state==="STOP_EVALUATION"?this.hasPassedExit(e.position)?(this.state="COMPLETED",this.startLampOn=!1,{toast:this.stopClassification==="VALID_STOP"?"Hoàn thành bài 2 — dừng đúng vạch":"Hoàn thành bài 2",penalties:t,completed:!0,disqualified:!1,stopClassification:this.stopClassification}):(!s&&e.engineRunning&&(this.startLampOn=!0),{penalties:t,completed:!1,disqualified:!1,stopClassification:this.stopClassification}):{penalties:t,completed:!1,disqualified:!1}}evaluateStop(e,t){e<0?(this._stopClassification="STOP_OVER_LINE",t(this.stopOverLinePenalty,"Dừng xe quá vạch dừng quy định")):e>this.maxDistanceBeforeLineM?(this._stopClassification="STOP_TOO_EARLY",t(this.stopTooEarlyPenalty,"Dừng xe chưa đến vạch dừng quy định")):this._stopClassification="VALID_STOP"}}const cx={exitDistanceM:3,stopSpeedKmh:.6,minStopDwellSec:.3},hx=2;class dx{id="EXAM_03_HILL_STOP_AND_START";state="INACTIVE";stopLineX;yellowLineX;exitX;maxDistanceBeforeLineM;maxRollbackM;maxStartTimeSec;maxRPM;stallPenalty;rpmExceededPenalty;stopTooEarlyPenalty;speedingIntervalSec;speedingPenaltyPerInterval;stopSpeedKmh;minStopDwellSec;hillForwardAxis;stoppedSince=0;activatedAt=0;stopEvaluated=!1;vehicleStopped=!1;crossedStopLineAfterRestart=!1;rpmViolationLatched=!1;speedingSec=0;arrivalOvertimeSec=0;engineWasRunning=!1;stallLatched=!1;stallEventCount=0;readyBeepFired=!1;waitingToastFired=!1;startDeadlineAt=0;stoppedPosition=null;_rollbackM=0;timeRemainingSec;_stopClassification;_disqualifyReason="";constructor(e){const t={...cx,...e};this.stopLineX=t.stopLineX,this.yellowLineX=t.yellowLineX,this.exitX=t.stopLineX+t.exitDistanceM,this.stopSpeedKmh=t.stopSpeedKmh,this.minStopDwellSec=t.minStopDwellSec,this.hillForwardAxis=t.hillForwardAxis?.clone()??new E(1,0,0);const n=Qc;this.maxDistanceBeforeLineM=n.stopPosition.maxDistanceBeforeLineM,this.maxRollbackM=n.hillStart.maxRollbackM,this.maxStartTimeSec=n.hillStart.mustCrossStopPositionWithinSec,this.maxRPM=n.engine.maxRPM,this.stallPenalty=n.engine.stallPenalty[$t],this.rpmExceededPenalty=n.engine.rpmExceededPenalty[$t],this.stopTooEarlyPenalty=n.penalties.stopTooEarly,this.speedingIntervalSec=n.speeding.intervalSec,this.speedingPenaltyPerInterval=n.speeding.penaltyPerInterval}get title(){switch(this.state){case"INACTIVE":return"Bài 3 · Dừng và khởi hành ngang dốc";case"APPROACHING_STOP_LINE":return"Bài 3 · Lên dốc, chuẩn bị dừng";case"STOP_EVALUATION":return"Bài 3 · Đánh giá vị trí dừng";case"WAITING_TO_START":return"Bài 3 · Chuẩn bị khởi hành";case"HILL_STARTING":return"Bài 3 · Khởi hành lên dốc";case"START_COMPLETED":return"Bài 3 · Qua đỉnh dốc";case"LEAVE_HILL":return"Bài 3 · Rời khỏi dốc";case"COMPLETED":return"Bài 3";case"DISQUALIFIED":return"Bài 3 · Đình chỉ"}}get rollbackM(){return this._rollbackM}get stopClassification(){return this._stopClassification}reset(){this.state="INACTIVE",this.stoppedSince=0,this.activatedAt=0,this.stopEvaluated=!1,this.vehicleStopped=!1,this.crossedStopLineAfterRestart=!1,this.rpmViolationLatched=!1,this.speedingSec=0,this.arrivalOvertimeSec=0,this.engineWasRunning=!1,this.stallLatched=!1,this.stallEventCount=0,this.stoppedPosition=null,this._rollbackM=0,this.timeRemainingSec=void 0,this._stopClassification=void 0,this._disqualifyReason="",this.readyBeepFired=!1,this.waitingToastFired=!1,this.startDeadlineAt=0}activate(){this.state="APPROACHING_STOP_LINE",this.activatedAt=performance.now()}signedDistanceToStopLine(e){return this.stopLineX-e.x}hasCrossedStopLine(e){return e.x>=this.stopLineX}hasCrossedYellowLine(e){return e>=this.yellowLineX}hasPassedExit(e){return e.x>=this.exitX}calculateRollback(e){if(!this.stoppedPosition)return 0;const n=e.clone().sub(this.stoppedPosition).dot(this.hillForwardAxis);return Math.max(0,-n)}update(e){if(this.state==="INACTIVE"||this.state==="COMPLETED"||this.state==="DISQUALIFIED")return{penalties:[],completed:this.state==="COMPLETED",disqualified:this.state==="DISQUALIFIED"};const t=[],n=performance.now(),i=(o,l)=>{t.push({at:n,points:o,reason:l})};e.frontPosition.x;const s=Math.abs(e.speedKmh)<this.stopSpeedKmh;e.engineRunning&&!this.engineWasRunning&&(this.stallLatched=!1),this.engineWasRunning=e.engineRunning,!e.engineRunning&&!this.stallLatched&&e.clutch<.5&&(this.stallLatched=!0,this.stallEventCount+=1,i(this.stallPenalty,"Chết máy")),e.rpm>this.maxRPM&&!this.rpmViolationLatched?(this.rpmViolationLatched=!0,i(this.rpmExceededPenalty,`Vòng tua máy vượt ${this.maxRPM} vòng/phút`)):e.rpm<=this.maxRPM*.95&&(this.rpmViolationLatched=!1);const a=Qc.maxSpeedKmh[$t];if(e.speedKmh>a?(this.speedingSec+=e.dt,this.speedingSec>=this.speedingIntervalSec&&(this.speedingSec=0,i(this.speedingPenaltyPerInterval,`Vượt tốc độ quy định (${a} km/h)`))):this.speedingSec=0,(this.state==="APPROACHING_STOP_LINE"||this.state==="STOP_EVALUATION")&&(this.arrivalOvertimeSec+=e.dt),this.state==="APPROACHING_STOP_LINE"){if(this.hasCrossedStopLine(e.frontPosition)&&!this.stopEvaluated)return this.stopEvaluated=!0,this._stopClassification="NO_REQUIRED_STOP",this.state="DISQUALIFIED",this._disqualifyReason="Không dừng xe ở vạch dừng quy định",{penalties:t,completed:!1,disqualified:!0,stopClassification:this._stopClassification,disqualifyReason:this._disqualifyReason};if(s){const o=this.signedDistanceToStopLine(e.frontPosition);if(this.stoppedSince===0&&(this.stoppedSince=n),(n-this.stoppedSince)/1e3>=this.minStopDwellSec&&!this.stopEvaluated)return this.stopEvaluated=!0,this.vehicleStopped=!0,this.evaluateStop(o,i),this._stopClassification==="STOP_OVER_LINE"?(this.state="DISQUALIFIED",this._disqualifyReason="Dừng xe quá vạch dừng quy định",{penalties:t,completed:!1,disqualified:!0,stopClassification:this._stopClassification,disqualifyReason:this._disqualifyReason}):(this.state="STOP_EVALUATION",this.stoppedPosition=e.position.clone(),{toast:this._stopClassification==="VALID_STOP"?"Dừng đúng vị trí":"Dừng chưa đến vạch (-5 điểm)",penalties:t,completed:!1,disqualified:!1,stopClassification:this._stopClassification})}else this.stoppedSince=0;return{penalties:t,completed:!1,disqualified:!1}}if(this.state==="STOP_EVALUATION")return this.state="WAITING_TO_START",{toast:this._stopClassification==="VALID_STOP"?"Dừng đúng vị trí":"Dừng chưa đến vạch (-5 điểm)",penalties:t,completed:!1,disqualified:!1,stopClassification:this._stopClassification,stopDistanceA:this._stopClassification==="VALID_STOP"?0:void 0};if(this.state==="WAITING_TO_START"){const o=(n-this.stoppedSince)/1e3;if(fetch("http://127.0.0.1:7243/ingest/41ea114a-de22-43e0-a2f5-b772e9ee7100",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"a36477"},body:JSON.stringify({sessionId:"a36477",location:"Exam03Hill.ts:410",message:"WAITING_TO_START frame",data:{elapsedSec:o,waitingToastFired:this.waitingToastFired,readyBeepFired:this.readyBeepFired},runId:"dbg-waitingToast",hypothesisId:"H1fix",timestamp:Date.now()})}).catch(()=>{}),o>=hx&&!this.readyBeepFired)return this.readyBeepFired=!0,this.startDeadlineAt=n,this.state="HILL_STARTING",{toast:"Khởi hành lên dốc — 30 giây",penalties:t,completed:!1,disqualified:!1,stopClassification:this._stopClassification,timeRemainingSec:this.maxStartTimeSec,readyBeep:!0};if(!this.waitingToastFired)return this.waitingToastFired=!0,{toast:"Giữ chân phanh, chuẩn bị khởi hành",penalties:t,completed:!1,disqualified:!1,stopClassification:this._stopClassification}}if(this.state==="HILL_STARTING"){if(this._rollbackM=this.calculateRollback(e.position),this._rollbackM>this.maxRollbackM)return this.state="DISQUALIFIED",this._disqualifyReason=`Tụt dốc quá ${this.maxRollbackM*1e3} mm`,this.timeRemainingSec=void 0,{penalties:t,completed:!1,disqualified:!0,rollbackM:this._rollbackM,disqualifyReason:this._disqualifyReason};const o=(n-this.startDeadlineAt)/1e3;return this.timeRemainingSec=Math.max(0,this.maxStartTimeSec-o),!this.crossedStopLineAfterRestart&&this.hasCrossedStopLine(e.frontPosition)&&!s?(this.crossedStopLineAfterRestart=!0,this.state="START_COMPLETED",{toast:"Qua vị trí dừng thành công",penalties:t,completed:!1,disqualified:!1,rollbackM:this._rollbackM,timeRemainingSec:this.timeRemainingSec}):o>this.maxStartTimeSec?(this.state="DISQUALIFIED",this._disqualifyReason="Quá 30 giây từ khi dừng mà chưa khởi hành qua vạch",this.timeRemainingSec=0,{penalties:t,completed:!1,disqualified:!0,rollbackM:this._rollbackM,timeRemainingSec:0,disqualifyReason:this._disqualifyReason}):{penalties:t,completed:!1,disqualified:!1,rollbackM:this._rollbackM,timeRemainingSec:this.timeRemainingSec}}if(this.state==="START_COMPLETED"){this._rollbackM=this.calculateRollback(e.position);const o=(n-this.stoppedSince)/1e3;return this.timeRemainingSec=Math.max(0,this.maxStartTimeSec-o),this._rollbackM>this.maxRollbackM?(this.state="DISQUALIFIED",this._disqualifyReason=`Tụt dốc quá ${this.maxRollbackM*1e3} mm`,this.timeRemainingSec=void 0,{penalties:t,completed:!1,disqualified:!0,rollbackM:this._rollbackM,disqualifyReason:this._disqualifyReason}):this.hasPassedExit(e.position)?(this.state="COMPLETED",this.timeRemainingSec=void 0,{toast:"Hoàn thành bài 3 — Dừng và khởi hành ngang dốc",penalties:t,completed:!0,disqualified:!1,rollbackM:this._rollbackM}):(this.state="LEAVE_HILL",{penalties:t,completed:!1,disqualified:!1,rollbackM:this._rollbackM,timeRemainingSec:this.timeRemainingSec})}if(this.state==="LEAVE_HILL"){this._rollbackM=this.calculateRollback(e.position);const o=(n-this.stoppedSince)/1e3;return this.timeRemainingSec=Math.max(0,this.maxStartTimeSec-o),this.hasPassedExit(e.position)?(this.state="COMPLETED",this.timeRemainingSec=void 0,{toast:"Hoàn thành bài 3 — Dừng và khởi hành ngang dốc",penalties:t,completed:!0,disqualified:!1,rollbackM:this._rollbackM}):{penalties:t,completed:!1,disqualified:!1,rollbackM:this._rollbackM,timeRemainingSec:this.timeRemainingSec}}return{penalties:t,completed:!1,disqualified:!1}}evaluateStop(e,t){e<0?this._stopClassification="STOP_OVER_LINE":e>this.maxDistanceBeforeLineM?(this._stopClassification="STOP_TOO_EARLY",t(this.stopTooEarlyPenalty,"Dừng xe chưa đến vạch dừng quy định")):this._stopClassification="VALID_STOP"}playReadyBeep(){try{const e=new AudioContext,t=e.createOscillator(),n=e.createGain();t.connect(n),n.connect(e.destination),t.frequency.setValueAtTime(880,e.currentTime),t.frequency.exponentialRampToValueAtTime(440,e.currentTime+.3),n.gain.setValueAtTime(0,e.currentTime),n.gain.linearRampToValueAtTime(.4,e.currentTime+.02),n.gain.exponentialRampToValueAtTime(.01,e.currentTime+.25),t.start(e.currentTime),t.stop(e.currentTime+.3),setTimeout(()=>e.close(),500)}catch{}}}class ux{id="EXAM_04_WHEEL_TRACK_AND_RIGHT_ANGLE";state="INACTIVE";sensors=null;limitSec;overtimeIntervalSec;overtimePenalty;boundaryContactPenalty;sustainedContactIntervalSec;sustainedContactPenalty;curbTopY;maxRPM;stallPenalty;rpmExceededPenalty;maxSpeedKmh;speedingIntervalSec;speedingPenalty;wheelTrackMissingPenalty;wheelTrackOverlapPenalty;wheelTrackOverlapIntervalSec;wheelTrackOverlapSustainedPenalty;startedAt=0;wheelTrackCompleted=!1;frontPassengerPassed=!1;rearPassengerPassed=!1;wheelTrackPenaltyLatched=!1;wheelTrackOverlapActive=!1;wheelTrackOverlapStartedAt=null;wheelTrackOverlapIntervalCount=0;boundaryContactActive=!1;boundaryContactStartedAt=null;boundaryIntervalCount=0;startYellowLineCrossed=!1;endYellowLineCrossed=!1;prevEndInside=!1;rpmViolationLatched=!1;stallLatched=!1;stallEventCount=0;speedingSec=0;overtimeIntervalCount=0;_disqualifyReason="";startToastEmitted=!1;wheelYBaseline=-1;wheelYBaselineSamples=0;_tmp=new E;constructor(){const e=ix;this.limitSec=e.time.limitSec,this.overtimeIntervalSec=e.time.overtimeIntervalSec,this.overtimePenalty=e.time.overtimePenalty,this.boundaryContactPenalty=e.boundary.contactPenalty,this.sustainedContactIntervalSec=e.boundary.sustainedContactIntervalSec,this.sustainedContactPenalty=e.boundary.sustainedContactPenalty,this.maxRPM=e.engine.maxRPM,this.stallPenalty=e.engine.stallPenalty[$t],this.rpmExceededPenalty=e.engine.rpmExceededPenalty[$t],this.maxSpeedKmh=e.maxSpeedKmh[$t],this.speedingIntervalSec=e.speeding.intervalSec,this.speedingPenalty=e.speeding.penaltyPerInterval,this.wheelTrackMissingPenalty=e.wheelTrack.missingWheelPenalty,this.wheelTrackOverlapPenalty=e.wheelTrack.overlapContactPenalty,this.wheelTrackOverlapIntervalSec=e.wheelTrack.overlapSustainedIntervalSec,this.wheelTrackOverlapSustainedPenalty=e.wheelTrack.overlapSustainedPenalty,this.curbTopY=.15}swapToCourse(e){this.sensors=e,this.reset(),this.state="WHEEL_TRACK_ACTIVE"}findEnteredCourse(e,t){for(let n=0;n<t.length;n++)if(t[n].startYellowSensor.containsPoint(e))return n;return-1}get title(){switch(this.state){case"INACTIVE":return"Bài 4 · Vệt bánh xe & đường vuông góc";case"WHEEL_TRACK_ACTIVE":return"Bài 4 · Qua vệt bánh xe";case"WHEEL_TRACK_COMPLETED":return"Bài 4 · Đang qua đường vuông góc";case"RIGHT_ANGLE_ACTIVE":return"Bài 4 · Đường vuông góc";case"COMPLETED":return"Bài 4";case"DISQUALIFIED":return"Bài 4 · Đình chỉ"}}reset(){this.startedAt=0,this.wheelTrackCompleted=!1,this.frontPassengerPassed=!1,this.rearPassengerPassed=!1,this.wheelTrackPenaltyLatched=!1,this.wheelTrackOverlapActive=!1,this.wheelTrackOverlapStartedAt=null,this.wheelTrackOverlapIntervalCount=0,this.boundaryContactActive=!1,this.boundaryContactStartedAt=null,this.boundaryIntervalCount=0,this.startYellowLineCrossed=!1,this.endYellowLineCrossed=!1,this.rpmViolationLatched=!1,this.stallLatched=!1,this.stallEventCount=0,this.speedingSec=0,this.overtimeIntervalCount=0,this._disqualifyReason="",this.startToastEmitted=!1,this.prevEndInside=!1,this.wheelYBaseline=-1,this.wheelYBaselineSamples=0}update(e){if(this.state==="INACTIVE"||this.state==="COMPLETED"||this.state==="DISQUALIFIED")return{penalties:[],completed:this.state==="COMPLETED",disqualified:this.state==="DISQUALIFIED"};const t=performance.now(),n=this.sensors,i=[];let s;const a=(_,p)=>{i.push({at:t,points:_,reason:p})};this.state==="WHEEL_TRACK_ACTIVE"&&!this.startToastEmitted&&(this.startToastEmitted=!0,s="Bắt đầu bài 4 — Vệt bánh xe & đường vuông góc (02:00)"),this.startedAt===0&&(this.startedAt=t);const o=(t-this.startedAt)/1e3,l=Math.max(0,this.limitSec-o),c=Math.floor(o/this.overtimeIntervalSec);c>this.overtimeIntervalCount&&(this.overtimeIntervalCount=c,a(this.overtimePenalty,"Quá thời gian 02 phút thực hiện bài số 4")),e.engineRunning&&!this.stallLatched&&e.clutch<.5&&(this.stallLatched=!0,this.stallEventCount+=1,a(this.stallPenalty,"Chết máy")),e.engineRunning||(this.stallLatched=!1),e.rpm>this.maxRPM&&!this.rpmViolationLatched?(this.rpmViolationLatched=!0,a(this.rpmExceededPenalty,`Vòng tua máy vượt ${this.maxRPM} vòng/phút`)):e.rpm<=this.maxRPM*.95&&(this.rpmViolationLatched=!1),e.speedKmh>this.maxSpeedKmh?(this.speedingSec+=e.dt,this.speedingSec>=this.speedingIntervalSec&&(this.speedingSec=0,a(this.speedingPenalty,`Vượt tốc độ quy định (${this.maxSpeedKmh} km/h)`))):this.speedingSec=0;const h=n.wheelTrackZone.containsPoint(e.wheelPositions.FR),d=n.wheelTrackZone.containsPoint(e.wheelPositions.RR);if((this.state==="WHEEL_TRACK_ACTIVE"||this.state==="WHEEL_TRACK_COMPLETED")&&!this.wheelTrackCompleted&&(h&&!this.frontPassengerPassed&&(this.frontPassengerPassed=!0),d&&!this.rearPassengerPassed&&(this.rearPassengerPassed=!0),(this.frontPassengerPassed||this.rearPassengerPassed)&&(this.wheelTrackCompleted=!0,this.state="RIGHT_ANGLE_ACTIVE",!this.wheelTrackPenaltyLatched))){this.wheelTrackPenaltyLatched=!0;const _=[];this.frontPassengerPassed||(i.push({at:t,points:this.wheelTrackMissingPenalty,reason:"Bánh trước bên lái phụ chưa qua vệt bánh xe"}),_.push("trước")),this.rearPassengerPassed||(i.push({at:t,points:this.wheelTrackMissingPenalty,reason:"Bánh sau bên lái phụ chưa qua vệt bánh xe"}),_.push("sau")),_.length>0&&(s=`Hoàn thành vệt bánh xe (thiếu bánh ${_.join(" + ")} — bị trừ điểm)`)}if(n.wheelTrackZone.containsPoint(e.wheelPositions.FL)||n.wheelTrackZone.containsPoint(e.wheelPositions.FR)||n.wheelTrackZone.containsPoint(e.wheelPositions.RL)||n.wheelTrackZone.containsPoint(e.wheelPositions.RR)){this.wheelTrackOverlapActive||(this.wheelTrackOverlapActive=!0,this.wheelTrackOverlapStartedAt=t,a(this.wheelTrackOverlapPenalty,"Bánh xe đè lên vệt bánh xe"));const _=(t-this.wheelTrackOverlapStartedAt)/1e3,p=Math.floor(_/this.wheelTrackOverlapIntervalSec);for(;this.wheelTrackOverlapIntervalCount<p;)this.wheelTrackOverlapIntervalCount++,a(this.wheelTrackOverlapSustainedPenalty,"Bánh xe đè lên vệt bánh xe kéo dài quá 5 giây")}else this.wheelTrackOverlapActive=!1,this.wheelTrackOverlapStartedAt=null,this.wheelTrackOverlapIntervalCount=0;let u=!1;for(const _ of n.boundarySensors)if(_.containsPoint(e.wheelPositions.FL)||_.containsPoint(e.wheelPositions.FR)||_.containsPoint(e.wheelPositions.RL)||_.containsPoint(e.wheelPositions.RR)){u=!0;break}if(u){this.boundaryContactActive||(this.boundaryContactActive=!0,this.boundaryContactStartedAt=t,a(this.boundaryContactPenalty,"Bánh xe đè vạch giới hạn"));const _=(t-this.boundaryContactStartedAt)/1e3,p=Math.floor(_/this.sustainedContactIntervalSec);for(;this.boundaryIntervalCount<p;)this.boundaryIntervalCount++,a(this.sustainedContactPenalty,"Bánh xe đè vạch kéo dài quá 5 giây")}else this.boundaryContactActive=!1,this.boundaryContactStartedAt=null,this.boundaryIntervalCount=0;if(this.state==="WHEEL_TRACK_ACTIVE"||this.state==="WHEEL_TRACK_COMPLETED"||this.state==="RIGHT_ANGLE_ACTIVE"){if(e.accident===!0)return this.state="DISQUALIFIED",this._disqualifyReason="Xử lý tình huống không hợp lý gây tai nạn",{toast:s,penalties:i,completed:!1,disqualified:!0,disqualifyReason:this._disqualifyReason};if(e.wrongLayout===!0)return this.state="DISQUALIFIED",this._disqualifyReason="Đi không đúng hình của hạng xe sát hạch",{toast:s,penalties:i,completed:!1,disqualified:!0,disqualifyReason:this._disqualifyReason};if((()=>{if(this.wheelYBaseline<0&&this.wheelYBaselineSamples<10){const m=(e.wheelPositions.FL.y+e.wheelPositions.FR.y+e.wheelPositions.RL.y+e.wheelPositions.RR.y)/4;return this.wheelYBaselineSamples===0?this.wheelYBaseline=m:this.wheelYBaseline=this.wheelYBaseline*.7+m*.3,this.wheelYBaselineSamples++,!1}const p=this.wheelYBaseline+.15;return e.wheelPositions.FL.y>p||e.wheelPositions.FR.y>p||e.wheelPositions.RL.y>p||e.wheelPositions.RR.y>p})())return this.state="DISQUALIFIED",this._disqualifyReason="Lái xe lên vỉa hè",{toast:s,penalties:i,completed:!1,disqualified:!0,disqualifyReason:this._disqualifyReason}}return!this.endYellowLineCrossed&&this.hasCrossedEndYellow(e)?(this.endYellowLineCrossed=!0,this.state="COMPLETED",{toast:this.wheelTrackCompleted?s??"Hoàn thành bài 4 — Vệt bánh xe & đường vuông góc":"Hoàn thành bài 4 (chưa qua hết vệt bánh xe — bị trừ điểm)",penalties:i,completed:!0,disqualified:!1,wheelTrackCompleted:this.wheelTrackCompleted,timeRemainingSec:l}):{toast:s??void 0,penalties:i,completed:!1,disqualified:!1,wheelTrackCompleted:this.wheelTrackCompleted,timeRemainingSec:l}}hasCrossedEndYellow(e){if(!this.sensors)return!1;const n=this.sensors.endYellowSensor.containsPoint(e.frontPosition),i=n&&!this.prevEndInside;return this.prevEndInside=n,i}anyWheelOnCurb(e){return this.sensors?e.wheelPositions.FL.y>this.curbTopY||e.wheelPositions.FR.y>this.curbTopY||e.wheelPositions.RL.y>this.curbTopY||e.wheelPositions.RR.y>this.curbTopY:!1}}const _s={roadWidth:8,stopSpeedKmh:.6,minStopDwellSec:.3};class cl{id="EXAM_05_SIGNALIZED_INTERSECTION";state="INACTIVE";stopLine;overLine;overLineDeep;approachZone;stopLineWorldZ;light;roadWidth;stopSpeedKmh;minStopDwellSec;rules=eh($t);stallPenaltyPoints;stoppedSince=0;stopEvaluated=!1;redLightPenaltyApplied=!1;stallLatched=!1;engineWasRunning=!1;_stopClassification;completed=!1;completionZone=new Be;hasCompletionZone=!1;constructor(e){this.roadWidth=e?.roadWidth??_s.roadWidth,this.stopSpeedKmh=e?.stopSpeedKmh??_s.stopSpeedKmh,this.minStopDwellSec=e?.minStopDwellSec??_s.minStopDwellSec,this.stopLineWorldZ=0;const t=eh($t);this.stallPenaltyPoints=t.engine.stallPenalty,this.stopLine=new Be,this.overLine=new Be,this.overLineDeep=new Be,this.approachZone=new Be,e?.light&&e?.roadZ!==void 0&&this.attach(e)}attach(e){if(e.roadZ===void 0){this.light=e.light;return}this.light=e.light;const t=e.roadZ;(e.roadWidth??_s.roadWidth)/2;const n=cl.buildSensorsFromLight(e.light,e.roadWidth??_s.roadWidth,t);if(this.stopLine=n.stopLine,this.overLine=n.overLine,this.overLineDeep=n.overLineDeep,this.approachZone=n.approachZone,this.stopLineWorldZ=n.stopLineWorldZ,e.completionZoneCenter){const i=e.completionZoneCenter.x,s=e.completionZoneCenter.z,{widthX:a,lengthZ:o}=e.completionZoneSize??{widthX:6,lengthZ:6};this.completionZone.setFromCenterAndSize(new E(i,0,s),new E(a,4,o)),this.hasCompletionZone=!0}}static buildSensorsFromLight(e,t,n){e.root.updateWorldMatrix(!0,!1);const a=new E(e.stopLineX,.1,e.stopLineZ).clone().applyMatrix4(e.root.matrixWorld).z,o=t/2,l=new Be(new E(n-o,-1,a-.15),new E(n+o,3,a+.15)),c=new Be(new E(n-o,-1,a-1),new E(n+o,3,a-.15)),h=new Be(new E(n-o,-1,a-1.15),new E(n+o,3,a-1)),d=new Be(new E(n-o,-1,a+.15),new E(n+o,3,a+15));return{stopLine:l,overLine:c,overLineDeep:h,approachZone:d,stopLineWorldZ:a}}get title(){switch(this.state){case"INACTIVE":return"Bài 5 · Ngã tư có tín hiệu";case"APPROACHING":return"Bài 5 · Chờ đèn xanh";case"STOP_EVALUATION":return"Bài 5 · Đánh giá vị trí dừng";case"COMPLETED":return"Bài 5";case"DISQUALIFIED":return"Bài 5 · Đình chỉ"}}get stopClassification(){return this._stopClassification}reset(){this.state="INACTIVE",this.stoppedSince=0,this.stopEvaluated=!1,this.redLightPenaltyApplied=!1,this.stallLatched=!1,this.engineWasRunning=!1,this._stopClassification=void 0,this.completed=!1}activate(){this.state==="INACTIVE"&&(this.state="APPROACHING")}signedDistanceToStopLine(e){return e.z-this.stopLineWorldZ}update(e){if(this.state==="INACTIVE"||this.state==="COMPLETED"||this.state==="DISQUALIFIED")return{penalties:[],completed:this.state==="COMPLETED",disqualified:this.state==="DISQUALIFIED"};if(this.completed)return{penalties:[],completed:!0,disqualified:!1,stopClassification:this._stopClassification};if(this.hasCompletionZone&&this.completionZone.containsPoint(e.frontPosition))return this.completed=!0,this.state="COMPLETED",{toast:"Hoàn thành bài 5",penalties:[],completed:!0,disqualified:!1,stopClassification:this._stopClassification};const t=[],n=performance.now(),i=(l,c)=>{t.push({at:n,points:l,reason:c})},s=Math.abs(e.speedKmh)<this.stopSpeedKmh,a=this.overLine.containsPoint(e.frontPosition),o=this.stopLine.containsPoint(e.frontPosition);if(e.engineRunning&&!this.engineWasRunning&&(this.stallLatched=!1),this.engineWasRunning=e.engineRunning,!e.engineRunning&&!this.stallLatched&&e.clutch<.5&&(this.state==="APPROACHING"||this.state==="STOP_EVALUATION")&&(this.stallLatched=!0,i(this.stallPenaltyPoints,"Chết máy")),!this.redLightPenaltyApplied&&a&&this.light?.phase==="red"&&(this.redLightPenaltyApplied=!0,i(this.rules.penalties.redLight,"Đi qua ngã tư khi đèn đỏ")),this.state==="APPROACHING"){if(this.overLineDeep.containsPoint(e.frontPosition)&&!o)return this.stopEvaluated||(this.stopEvaluated=!0,this._stopClassification="NO_REQUIRED_STOP"),this.state="STOP_EVALUATION",{toast:"Đã qua vạch dừng",penalties:t,completed:!1,disqualified:!1,stopClassification:this._stopClassification};const c=this.signedDistanceToStopLine(e.frontPosition);if(c>-1.15&&c<1.15&&s){if(this.stoppedSince===0&&(this.stoppedSince=n),(n-this.stoppedSince)/1e3>=this.minStopDwellSec&&!this.stopEvaluated)return this.stopEvaluated=!0,this.evaluateStop(c,i),this.state="STOP_EVALUATION",{toast:this._stopClassification==="VALID_STOP"?"Dừng đúng vị trí":"Đánh giá vị trí dừng",penalties:t,completed:!1,disqualified:!1,stopClassification:this._stopClassification}}else this.stoppedSince=0;return{penalties:t,completed:!1,disqualified:!1}}if(this.state==="STOP_EVALUATION"){if(!this.stopEvaluated){const l=this.signedDistanceToStopLine(e.frontPosition);if(l>-1.15&&l<1.15&&s){if(this.stoppedSince===0&&(this.stoppedSince=n),(n-this.stoppedSince)/1e3>=this.minStopDwellSec)return this.stopEvaluated=!0,this.evaluateStop(l,i),{toast:this._stopClassification==="VALID_STOP"?"Dừng đúng vị trí":"Đánh giá vị trí dừng",penalties:t,completed:!1,disqualified:!1,stopClassification:this._stopClassification}}else this.stoppedSince=0}return{penalties:t,completed:!1,disqualified:!1,stopClassification:this._stopClassification}}return{penalties:t,completed:!1,disqualified:!1}}evaluateStop(e,t){e<-1?(this._stopClassification="STOP_OVER_LINE",t(this.rules.penalties.stopOverLine,"Dừng xe quá vạch dừng quy định")):e>1?(this._stopClassification="STOP_TOO_EARLY",t(this.rules.penalties.stopTooEarly,"Dừng xe chưa đến vạch dừng quy định")):this._stopClassification="VALID_STOP"}}const fx=-8,px=31-5.5,mx=31-9.5;class gx{score=100;penalties=[];activeIndex=0;startedAt=performance.now();startExercise=new ax;pedestrianExercise=new lx({stopLineX:fx,roadZ:Lt.lineZ,roadWidth:8,approachZoneM:15,exitDistanceM:3,stopSpeedKmh:.6,minStopDwellSec:.3});hillExercise=new dx({stopLineX:px,yellowLineX:mx,roadZ:Lt.lineZ,roadWidth:8,hillForwardAxis:new E(1,0,0),exitDistanceM:3,stopSpeedKmh:.6,minStopDwellSec:.3});wheelTrackSensors=[];wheelTrackExercise=new ux;intersectionExercise=new cl;southLight=null;exam05Wired=!1;disqualified=!1;disqualifyReason="";cooldown=new Map;finished=!1;pedestrianCompleted=!1;awaitingExam05=!1;lockedCourseIndex=null;reset(){this.score=100,this.penalties.length=0,this.activeIndex=0,this.startedAt=performance.now(),this.cooldown.clear(),this.finished=!1,this.disqualified=!1,this.disqualifyReason="",this.pedestrianCompleted=!1,this.lockedCourseIndex=null,this.awaitingExam05=!1,this.startExercise.reset(),this.pedestrianExercise.reset(),this.hillExercise.reset(),this.wheelTrackExercise.reset(),this.intersectionExercise.reset(),this.southLight?.reset()}wireExam04(e){this.wheelTrackSensors.length=0;for(let t=0;t<e.length;t++){const n=e[t];this.wheelTrackSensors.push({index:t,startYellowSensor:n.startYellowSensor,endYellowSensor:n.endYellowSensor,wheelTrackZone:n.wheelTrackZone,boundarySensors:n.boundarySensors,entryWorld:n.entryWorld,exitForwardAxis:n.exitForwardAxis})}}wireExam05South(e,t=21,n=8){if(this.exam05Wired)return;const i=e.getTrafficLight("SOUTH");if(!i){console.warn('[ExamEngine] wireExam05South: track has no trafficLight with markerId="SOUTH"');return}this.southLight=i,this.intersectionExercise.attach({light:i,roadWidth:n,roadZ:t,completionZoneCenter:{x:23,z:-45},completionZoneSize:{widthX:4,lengthZ:6}}),i.onMarkerTriggered=s=>{s==="SOUTH"&&this.activeIndex<4&&!this.disqualified&&(this.activeIndex=4,this.intersectionExercise.activate())},this.exam05Wired=!0}update(e,t,n){if(!this.finished){if(this.activeIndex===0){const i=this.startExercise.update({...e,startSignal:t,dt:n});for(const s of i.penalties)this.applyPenaltyEvent(s);return i.disqualified&&(this.disqualified=!0,this.finished=!0,this.disqualifyReason=i.disqualifyReason??i.toast?.replace(/^Đình chỉ sát hạch — /,"")??"Đình chỉ sát hạch"),i.completed&&(this.activeIndex=1,this.startedAt=performance.now(),this.pedestrianExercise.activate()),i.toast==="Bắt đầu thi"&&(this.startedAt=performance.now()),i.toast}if(this.activeIndex===1){const i={position:e.position,frontPosition:e.frontPosition,speedKmh:e.speedKmh,rpm:e.rpm,engineRunning:e.engineRunning,stalled:e.stalled,seatBeltFastened:e.seatBeltFastened,leftSignal:e.leftSignal,clutch:e.clutch??1,dt:n},s=this.pedestrianExercise.update(i);for(const a of s.penalties)this.applyPenaltyEvent(a);return s.disqualified&&(this.disqualified=!0,this.finished=!0,this.disqualifyReason=s.disqualifyReason??s.toast?.replace(/^Đình chỉ sát hạch — /,"")??"Đình chỉ sát hạch"),s.completed&&(this.pedestrianCompleted=!0,this.activeIndex=2,this.startedAt=performance.now(),this.hillExercise.activate()),s.toast}if(this.activeIndex===2){const i=2*e.position.x-e.frontPosition.x,s={position:e.position,frontPosition:e.frontPosition,rearWheelX:i,hillForwardAxis:new E(1,0,0),speedKmh:e.speedKmh,rpm:e.rpm,engineRunning:e.engineRunning,stalled:e.stalled,clutch:e.clutch??1,dt:n},a=this.hillExercise.update(s);for(const o of a.penalties)this.applyPenaltyEvent(o);return a.disqualified&&(this.disqualified=!0,this.finished=!0,this.disqualifyReason=a.disqualifyReason??a.toast?.replace(/^Đình chỉ — /,"")??"Đình chỉ sát hạch"),a.completed&&(this.activeIndex=3),a.readyBeep&&this.hillExercise.playReadyBeep(),a.toast}if(this.activeIndex===3){if(this.wheelTrackExercise.state==="INACTIVE"){if(this.lockedCourseIndex===null){const o=this.wheelTrackExercise.findEnteredCourse(e.frontPosition,this.wheelTrackSensors);if(o>=0){this.lockedCourseIndex=o,this.wheelTrackExercise.swapToCourse(this.wheelTrackSensors[o]);const l={position:e.position,frontPosition:e.frontPosition,wheelPositions:e.wheelPositions??{FL:e.position.clone(),FR:e.position.clone(),RL:e.position.clone(),RR:e.position.clone()},speedKmh:e.speedKmh,rpm:e.rpm,engineRunning:e.engineRunning,stalled:e.stalled,clutch:e.clutch??1,dt:n,accident:e.accident??!1,wrongLayout:e.wrongLayout??!1};this.wheelTrackExercise.update(l)}}return}const s={position:e.position,frontPosition:e.frontPosition,wheelPositions:e.wheelPositions??{FL:e.position.clone(),FR:e.position.clone(),RL:e.position.clone(),RR:e.position.clone()},speedKmh:e.speedKmh,rpm:e.rpm,engineRunning:e.engineRunning,stalled:e.stalled,clutch:e.clutch??1,dt:n,accident:e.accident??!1,wrongLayout:e.wrongLayout??!1},a=this.wheelTrackExercise.update(s);for(const o of a.penalties)this.applyPenaltyEvent(o);return a.disqualified?(this.disqualified=!0,this.finished=!0,this.disqualifyReason=a.disqualifyReason??a.toast?.replace(/^Đình chỉ sát hạch — /,"")??"Đình chỉ sát hạch",a.toast):a.completed?this.awaitingExam05?void 0:(this.awaitingExam05=!0,a.toast??"Hoàn thành bài 4"):a.toast}if(this.activeIndex===4){const i={position:e.position,frontPosition:e.frontPosition,speedKmh:e.speedKmh,rpm:e.rpm,engineRunning:e.engineRunning,stalled:e.stalled,clutch:e.clutch??1,dt:n},s=this.intersectionExercise.update(i);for(const a of s.penalties)this.applyPenaltyEvent(a);return s.disqualified?(this.disqualified=!0,this.finished=!0,this.disqualifyReason=s.disqualifyReason??s.toast?.replace(/^Đình chỉ sát hạch — /,"")??"Đình chỉ sát hạch",s.toast):s.completed?(this.finished=!0,s.toast??"Hoàn thành bài 5"):s.toast}}}applyLinePenalty(e,t){const n=this.cooldown.get(e)??-1/0;if(t-n<3e3)return null;this.cooldown.set(e,t);const i={at:t,points:5,reason:"Chạm vạch giới hạn"};return this.penalties.push(i),this.score=Math.max(0,this.score-5),i}applyPenaltyEvent(e){this.penalties.push(e),this.score=Math.max(0,this.score-e.points)}get approaching(){return this.activeIndex===0&&(this.startExercise.state==="PRE_START"||this.startExercise.state==="COUNTDOWN_5S")}get startLampOn(){return this.activeIndex===0?this.startExercise.startLampOn:this.activeIndex===1?this.pedestrianExercise.startLampOn:!1}get elapsedSeconds(){return(performance.now()-this.startedAt)/1e3}get currentExerciseTitle(){return this.finished?"Hoàn thành bài thi":this.awaitingExam05?"Chờ vào bài 5":this.activeIndex===0?this.startExercise.title:this.activeIndex===1?this.pedestrianExercise.title:this.activeIndex===2?this.hillExercise.title:this.activeIndex===3?this.wheelTrackExercise.title:this.activeIndex===4?this.intersectionExercise.title:"Hoàn thành"}get isFinished(){return this.finished}}class _x{mode=0;camera=new wt(60,1,.1,500);followFocus=new E;followOffset=new E;previousMode=-1;developMode;freeYaw=0;freePitch=Math.PI*.15;freePosition=new E(0,10,20);dragging=!1;lastMouseX=0;lastMouseY=0;constructor(e){this.developMode=e??!1,this.developMode&&(document.addEventListener("mousedown",this.onMouseDown),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp),document.addEventListener("contextmenu",t=>t.preventDefault()))}onMouseDown=e=>{e.button===2&&(this.dragging=!0,this.lastMouseX=e.clientX,this.lastMouseY=e.clientY)};onMouseMove=e=>{if(!this.dragging)return;const t=e.clientX-this.lastMouseX,n=e.clientY-this.lastMouseY;this.freeYaw-=t*.003,this.freePitch-=n*.003,this.freePitch=Math.max(-Math.PI*.45,Math.min(Math.PI*.45,this.freePitch)),this.lastMouseX=e.clientX,this.lastMouseY=e.clientY};onMouseUp=e=>{e.button===2&&(this.dragging=!1)};next(){this.developMode||(this.mode=(this.mode+1)%3)}attach(e){this.resize(e.clientWidth,e.clientHeight)}update(e,t,n){const i=n;if(this.developMode){this.updateFreeCamera(t,i);return}const s=e.root;let a=new E,o=s.position.clone();const l=this.previousMode!==this.mode,c=this.mode===0?35:60;if(this.camera.fov!==c&&(this.camera.fov=c,this.camera.updateProjectionMatrix()),this.mode===0){o.y+=.7,l?this.followFocus.copy(o):this.followFocus.lerp(o,1-Math.exp(-5*t));const h=Math.max(0,16/9/this.camera.aspect-1)*9;this.followOffset.setFromSphericalCoords(42+h,Math.PI*.3,-Math.PI*.5),o.copy(this.followFocus),a.copy(o).add(this.followOffset)}else if(this.mode===2){s.updateWorldMatrix(!0,!0);const d=s.children.find(f=>f.type==="Group")??s;a.copy(d.localToWorld(new E(-.43,1.45,-.1))),o.copy(d.localToWorld(new E(-.43,1.4,-20)))}else a.copy(s.position).add(new E(0,18,2)),o.copy(s.position);this.mode===0||this.mode===2||l?this.camera.position.copy(a):this.camera.position.lerp(a,1-Math.exp(-5*t)),this.camera.position.y+=e.transmission.car.jolt*.06,this.camera.lookAt(o),this.previousMode=this.mode}updateFreeCamera(e,t){const a=t?.isDown?.("ShiftLeft")||t?.isDown?.("ShiftRight"),o=a?60:20,l=a?30:10,c=Math.cos(this.freePitch),h=new E(Math.sin(this.freeYaw)*c,-Math.sin(this.freePitch),-Math.cos(this.freeYaw)*c).normalize(),d=new E(Math.cos(this.freeYaw),0,-Math.sin(this.freeYaw)),f=new E(0,1,0);(t?.isDown?.("KeyW")||t?.isDown?.("ArrowUp"))&&this.freePosition.addScaledVector(h,o*e),(t?.isDown?.("KeyS")||t?.isDown?.("ArrowDown"))&&this.freePosition.addScaledVector(h,-o*e),(t?.isDown?.("KeyA")||t?.isDown?.("ArrowLeft"))&&this.freePosition.addScaledVector(d,-o*e),(t?.isDown?.("KeyD")||t?.isDown?.("ArrowRight"))&&this.freePosition.addScaledVector(d,o*e),t?.isDown?.("KeyQ")&&this.freePosition.addScaledVector(f,-l*e),t?.isDown?.("KeyE")&&this.freePosition.addScaledVector(f,l*e),this.camera.position.copy(this.freePosition);const u=this.freePosition.clone().add(h);this.camera.lookAt(u),this.camera.fov!==60&&(this.camera.fov=60,this.camera.updateProjectionMatrix())}resize(e,t){this.camera.aspect=e/Math.max(1,t),this.camera.updateProjectionMatrix()}dispose(){this.developMode&&(document.removeEventListener("mousedown",this.onMouseDown),document.removeEventListener("mousemove",this.onMouseMove),document.removeEventListener("mouseup",this.onMouseUp))}}const th="notify-root";function vx(){let r=document.getElementById(th);return r||(r=document.createElement("div"),r.id=th,document.body.appendChild(r)),r}const Hr=[];function xx(r){switch(r){case"exam":return"◎";case"penalty":return"!";case"success":return"✓";case"disqualify":return"✕";case"warning":return"⚠";default:return"ℹ"}}function Fa(r,e=!1){const t=Hr.indexOf(r);if(t===-1)return;Hr.splice(t,1),r.dismissTimer&&window.clearTimeout(r.dismissTimer);const n=()=>{r.el.parentNode&&r.el.remove(),r.onDismiss()};if(e){n();return}r.el.classList.remove("notify-show"),r.el.classList.add("notify-hide"),window.setTimeout(n,240)}function Sx(r,e,t,n,i){const s=document.createElement("div");s.className="notify-card",s.dataset.kind=e,s.setAttribute("role",e==="penalty"||e==="disqualify"?"alert":"status");const a=document.createElement("div");a.className="notify-icon",a.textContent=xx(e),a.setAttribute("aria-hidden","true");const o=document.createElement("div");o.className="notify-body";const l=document.createElement("div");if(l.className="notify-title",l.textContent=r,o.appendChild(l),t){const h=document.createElement("div");h.className="notify-subtitle",h.textContent=t,o.appendChild(h)}s.appendChild(a),s.appendChild(o);let c=null;if(i>0&&Number.isFinite(i)&&(c=document.createElement("div"),c.className="notify-progress",s.appendChild(c)),n){const h=document.createElement("button");h.type="button",h.className="notify-action",h.textContent=n.label,h.onclick=d=>{d.stopPropagation();try{n.onClick()}catch{}},s.appendChild(h)}return{card:s,progress:c,body:o}}const hn={show(r,e={}){const t=e.kind??"info",n=e.persist?0:Math.max(800,e.durationMs??(t==="exam"?1500:t==="penalty"?1400:500)),i=vx(),{card:s,progress:a}=Sx(r,t,e.subtitle,e.action,n);i.appendChild(s);const o={el:s,progress:a??void 0,kind:t,persist:!!e.persist,startedAt:performance.now(),durationMs:n,onDismiss:()=>{}};return Hr.push(o),s.offsetWidth,s.classList.add("notify-show"),!e.persist&&n>0&&(o.dismissTimer=window.setTimeout(()=>Fa(o),n)),{dismiss:()=>Fa(o,!0),el:s}},showDisqualify(r,e,t){hn.clear();const n=document.getElementById("dq-overlay");n&&n.remove();const i=document.createElement("div");i.id="dq-overlay";const s=document.createElement("div");s.className="dq-card";const a=document.createElement("div");a.className="dq-icon",a.textContent="✕";const o=document.createElement("div");o.className="dq-heading",o.textContent="ĐÌNH CHỈ THI";const l=document.createElement("div");l.className="dq-score",l.textContent=`${r} điểm`;const c=document.createElement("div");c.className="dq-reason-label",c.textContent="Lý do bị đình chỉ";const h=document.createElement("div");h.className="dq-reason",h.textContent=e;const d=document.createElement("button");d.className="dq-btn",d.textContent="Thi lại",d.onclick=()=>{i.remove(),t()},s.appendChild(a),s.appendChild(o),s.appendChild(l),s.appendChild(c),s.appendChild(h),s.appendChild(d),i.appendChild(s),document.body.appendChild(i),requestAnimationFrame(()=>{i.classList.add("dq-show")})},clear(){for(const r of Hr.slice())Fa(r,!0)}};class yx{constructor(e,t,n,i,s){this.camera=e,this.track=t,this.dom=n,this.panel=i,this.develop=s,this.cursorDefault=this.dom.style.cursor||"default",this.develop&&(this.dom.addEventListener("mousedown",this.onMouseDown),window.addEventListener("keydown",this.onKeyDown))}camera;track;dom;panel;develop;raycaster=new Yh;ndc=new le;enabled=!1;cursorDefault;_editorActive=!1;_editorActiveGetter=null;setEditorActive(e){this._editorActiveGetter=e}onKeyDown=e=>{if(e.code!=="KeyP")return;const t=e.target;t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)||(e.preventDefault(),this.enabled=!this.enabled,this.dom.style.cursor=this.enabled?"crosshair":this.cursorDefault,this.enabled?hn.show("Probe: bật · click chuột để lấy toạ độ",{kind:"info",durationMs:1400}):(this.panel.hide(),hn.show("Probe: tắt",{kind:"info",durationMs:900})))};onMouseDown=e=>{this.enabled&&e.button===0&&this._editorActiveGetter?.()!==!0&&(e.preventDefault(),this.sampleAt(e.clientX,e.clientY))};sampleAt(e,t){const n=this.dom.getBoundingClientRect();this.ndc.x=(e-n.left)/n.width*2-1,this.ndc.y=-((t-n.top)/n.height)*2+1,this.raycaster.setFromCamera(this.ndc,this.camera);const s=this.raycaster.intersectObjects(this.track.root.children,!0)[0];if(!s){hn.show("Probe: không có mặt phẳng",{kind:"info",durationMs:1200});return}const a=s.point.x,o=s.point.z,l=this.track.getSurfaceHeight(a,o);this.panel.show(a,l,o),hn.show(`x: ${Ba(a)} · y: ${Ba(l)} · z: ${Ba(o)}`,{kind:"info",durationMs:1500})}dispose(){this.develop&&(this.dom.removeEventListener("mousedown",this.onMouseDown),window.removeEventListener("keydown",this.onKeyDown),this.dom.style.cursor=this.cursorDefault)}}function Ba(r){return r.toFixed(2)}class Mx{get isActive(){return this._state!=="idle"}raycaster=new Yh;ndc=new le;_state="idle";hoveredSegment=null;armed=null;hoveredWinding=null;armedWinding=null;cursorDefault;blinkStart=0;pressStart=null;dom;camera;track;constructor(e,t,n,i){this.camera=e,this.dom=t,this.track=n,this.cursorDefault=t.style.cursor||"default",i&&(t.addEventListener("mousemove",this.onMouseMove),t.addEventListener("mousedown",this.onMouseDown),t.addEventListener("mouseup",this.onMouseUp),t.addEventListener("contextmenu",s=>s.preventDefault()),window.addEventListener("keydown",this.onKeyDown))}dispose(){this.dom.removeEventListener("mousemove",this.onMouseMove),this.dom.removeEventListener("mousedown",this.onMouseDown),this.dom.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("keydown",this.onKeyDown),this.dom.style.cursor=this.cursorDefault,this.removeOutline()}ndcFromClient(e,t){const n=this.dom.getBoundingClientRect();this.ndc.x=(e-n.left)/n.width*2-1,this.ndc.y=-((t-n.top)/n.height)*2+1}raycastRoad(e,t){this.ndcFromClient(e,t),this.raycaster.setFromCamera(this.ndc,this.camera);const n=this.raycaster.intersectObjects(this.track.root.children,!0);for(const i of n){const s=this.findRoadOf(i.object);if(s)return s}return null}raycastGround(e,t,n){this.ndcFromClient(e,t),this.raycaster.setFromCamera(this.ndc,this.camera);const i=new Set(n.group.children),s=this.raycaster.intersectObjects(this.track.root.children,!0);for(const a of s)if(!i.has(a.object))return a.point.clone();return null}raycastGroundWinding(e,t){this.ndcFromClient(e,t),this.raycaster.setFromCamera(this.ndc,this.camera);const n=this.raycaster.intersectObjects(this.track.root.children,!0);for(const i of n){const s=this.track.findWindingCourseOf(i.object);if(!(this.armedWinding&&s===this.armedWinding.entry))return i.point.clone()}return null}findRoadOf(e){let t=e;for(;t;){if(t instanceof et&&t.name==="road")return this.track.getRoads().find(n=>n.group===t)??null;t=t.parent}return null}raycastWinding(e,t,n){this.ndcFromClient(e,t),this.raycaster.setFromCamera(this.ndc,this.camera);const i=n?new Set(n.group.children):new Set,s=this.raycaster.intersectObjects(this.track.root.children,!0);for(const a of s){if(i.has(a.object))continue;const o=this.track.findWindingCourseOf(a.object);if(o)return o}return null}buildOutline(e,t=.6){const n=e.bounds,i=e.group.position.y,s=[new E(n.minX,i+.01,n.minZ),new E(n.maxX,i+.01,n.minZ),new E(n.maxX,i+.01,n.maxZ),new E(n.minX,i+.01,n.maxZ),new E(n.minX,i+.01,n.minZ)],a=[];for(let h=0;h<s.length-1;h++)a.push(s[h].x,s[h].y,s[h].z,s[h+1].x,s[h+1].y,s[h+1].z);const o=new Tt;o.setAttribute("position",new ut(a,3)),o.computeBoundingBox();const l=new Fr({color:15780170,transparent:!0,opacity:t,depthTest:!1}),c=new Co(o,l);return c.renderOrder=999,this.track.root.add(c),c}removeOutline(){this.armed&&(this.track.root.remove(this.armed.outline),this.armed.outline.geometry.dispose(),this.armed.outline.material.dispose(),this.armed=null)}updateOutlineOpacity(e){this.armed&&(this.armed.outline.material.opacity=e)}rebuildOutline(){this.armed&&(this.track.root.remove(this.armed.outline),this.armed.outline.geometry.dispose(),this.armed.outline.material.dispose(),this.armed.outline=this.buildOutline(this.armed.road,1))}buildWindingOutline(e,t=.6){const{course:n,_entryLength:i,_exitLength:s}=e,a=n.root.position.x,o=n.root.position.z,l=n.width,h=(i+n.centreSpacing*2+s+4)/2,d=l/2+1,f=[new E(a-h,.01,o-d),new E(a+h,.01,o-d),new E(a+h,.01,o+d),new E(a-h,.01,o+d),new E(a-h,.01,o-d)],u=[];for(let m=0;m<f.length-1;m++)u.push(f[m].x,f[m].y,f[m].z,f[m+1].x,f[m+1].y,f[m+1].z);const g=new Tt;g.setAttribute("position",new ut(u,3)),g.computeBoundingBox();const _=new Fr({color:15780170,transparent:!0,opacity:t,depthTest:!1}),p=new Co(g,_);return p.renderOrder=999,this.track.root.add(p),p}removeWindingOutline(){this.armedWinding&&(this.track.root.remove(this.armedWinding.outline),this.armedWinding.outline.geometry.dispose(),this.armedWinding.outline.material.dispose(),this.armedWinding=null)}rebuildWindingOutline(){this.armedWinding&&(this.track.root.remove(this.armedWinding.outline),this.armedWinding.outline.geometry.dispose(),this.armedWinding.outline.material.dispose(),this.armedWinding.outline=this.buildWindingOutline(this.armedWinding.entry,1))}transition(e){this._state=e,e==="idle"&&(this.dom.style.cursor=this.cursorDefault,this.hoveredSegment=null,this.hoveredWinding=null,this.pressStart=null)}onMouseMove=e=>{if(this._state==="carrying"){if(this.armed){const i=this.raycastGround(e.clientX,e.clientY,this.armed.road);i&&(this.armed.road.group.position.x=Math.round(i.x/.5)*.5,this.armed.road.group.position.z=Math.round(i.z/.5)*.5,this.armed.road.group.position.y=.6,this.rebuildOutline())}else if(this.armedWinding){const i=this.raycastGroundWinding(e.clientX,e.clientY);if(i){const a=this.armedWinding.entry.course;a.root.position.x=Math.round(i.x/.5)*.5,a.root.position.z=Math.round(i.z/.5)*.5,a.root.position.y=.6,this.rebuildWindingOutline()}}return}const t=this.raycastRoad(e.clientX,e.clientY);if(t){this.clearWindingHover(),this.hoveredSegment!==t&&(this.hoveredSegment=t,this.blinkStart=performance.now()),this.dom.style.cursor="grab",this.transition("hover"),this.ensureOutlineFor(t,.6);return}const n=this.raycastWinding(e.clientX,e.clientY,null);if(n){this.clearRoadHover(),this.hoveredWinding!==n&&(this.hoveredWinding=n,this.blinkStart=performance.now()),this.dom.style.cursor="grab",this.transition("hover"),this.ensureWindingOutlineFor(n,.6);return}this.clearRoadHover(),this.clearWindingHover()};clearRoadHover(){this.hoveredSegment&&(this.hoveredSegment=null,this.dom.style.cursor=this.cursorDefault,this.removeOutline(),this.transition("idle"))}clearWindingHover(){this.hoveredWinding&&(this.hoveredWinding=null,this.dom.style.cursor=this.cursorDefault,this.removeWindingOutline(),this.transition("idle"))}onMouseDown=e=>{e.button===0&&(this._state==="idle"||this._state==="hover")&&(this.hoveredSegment?(this.pressStart=performance.now(),this.transition("pressing")):this.hoveredWinding&&(this.pressStart=performance.now(),this.transition("pressing")))};onMouseUp=e=>{if(e.button===0){if(this._state==="pressing"){this.pressStart=null,this.transition(this.hoveredSegment||this.hoveredWinding?"hover":"idle");return}if(this._state==="armed"){this.pressStart=null,this.transition("carrying"),this.dom.style.cursor="grabbing";return}if(this._state==="carrying"){this.armedWinding?this.placeWindingCourse():this.placeRoad();return}}};tick(e){if(this._state==="pressing"&&this.pressStart!==null){e-this.pressStart>=2e3&&(this.hoveredSegment?this.armRoad():this.hoveredWinding&&this.armWinding(),this.transition("armed"),this.pressStart=null);const n=(e-this.blinkStart)%1200,i=n<600?Dn.lerp(.3,.9,n/600):Dn.lerp(.9,.3,(n-600)/600);this.updateOutlineOpacity(i),this.updateWindingOutlineOpacity(i)}else if(this._state==="armed")this.updateOutlineOpacity(1),this.updateWindingOutlineOpacity(1);else if(this._state==="hover"){const t=(e-this.blinkStart)%2e3,n=t<1e3?Dn.lerp(.2,.6,t/1e3):Dn.lerp(.6,.2,(t-1e3)/1e3);this.updateOutlineOpacity(n),this.updateWindingOutlineOpacity(n)}}updateWindingOutlineOpacity(e){this.armedWinding&&(this.armedWinding.outline.material.opacity=e)}armRoad(){if(!this.hoveredSegment)return;const e=this.hoveredSegment;e.group.position.y=.6;const t=this.buildOutline(e,1);this.armed={road:e,origin:e.group.position.clone(),outline:t}}armWinding(){if(!this.hoveredWinding)return;const e=this.hoveredWinding;e.course.root.position.y=.6;const t=this.buildWindingOutline(e,1);this.armedWinding={entry:e,origin:e.course.root.position.clone(),outline:t}}ensureOutlineFor(e,t){if(!this.armed||this.armed.road!==e){this.armed&&this.removeOutline();const n=this.buildOutline(e,t);this.armed={road:e,origin:e.group.position.clone(),outline:n}}}ensureWindingOutlineFor(e,t){if(!this.armedWinding||this.armedWinding.entry!==e){this.armedWinding&&this.removeWindingOutline();const n=this.buildWindingOutline(e,t);this.armedWinding={entry:e,origin:e.course.root.position.clone(),outline:n}}}placeRoad(){if(!this.armed)return;const e=this.armed.road,t=e.group.position.x,n=e.group.position.z;e.group.position.set(t,0,n);const i=e.direction==="vertical"?8:20,s=e.direction==="vertical"?20:8;e.bounds={minX:t-(e.direction==="vertical"?i:s)/2,maxX:t+(e.direction==="vertical"?i:s)/2,minZ:n-(e.direction==="vertical"?s:i)/2,maxZ:n+(e.direction==="vertical"?s:i)/2},this.track.connectRoadIntersections();const a=this.track.getRoads().indexOf(e);a>=0&&this.track.persistRoadEdit(a,t,n),this.removeOutline(),this.hoveredSegment=null,this.dom.style.cursor=this.cursorDefault,this.transition("idle");const o=`objects.addRoad(${t.toFixed(1)}, ${n.toFixed(1)}, ${i}, ${s}, '${e.direction}', 'straight', 'white-dashed');`;console.log("[RoadEditor] Paste into buildExamGround.ts:"),console.log(o),hn.show(`Saved x=${t.toFixed(1)}, z=${n.toFixed(1)}`,{kind:"success",durationMs:2e3})}placeWindingCourse(){if(!this.armedWinding)return;const{entry:e}=this.armedWinding,t=e.course,n=t.root.position.x,i=t.root.position.z;t.root.position.set(n,0,i),t.root.updateMatrix(),this.track.rebuildWindingCourseRoads(e);const s=this.track.getWindingCourses().indexOf(e);s>=0&&this.track.persistWCEdit(s,n,i);for(const o of[e.entryRoadIndex,e.exitRoadIndex])this.track.getRoads()[o];this.track.connectRoadIntersections(),this.removeWindingOutline(),this.hoveredWinding=null,this.dom.style.cursor=this.cursorDefault,this.transition("idle");const a=`objects.addWindingCourse({ x: ${n.toFixed(1)}, z: ${i.toFixed(1)} });`;console.log("[RoadEditor] Paste into buildExamGround.ts:"),console.log(a),hn.show(`WindingCourse saved x=${n.toFixed(1)}, z=${i.toFixed(1)}`,{kind:"success",durationMs:2e3})}cancel(){this.armed&&this.armed.road.group.position.copy(this.armed.origin),this.armedWinding&&this.armedWinding.entry.course.root.position.copy(this.armedWinding.origin),this.removeOutline(),this.removeWindingOutline(),this.hoveredSegment=null,this.hoveredWinding=null,this.pressStart=null,this.dom.style.cursor=this.cursorDefault,this.transition("idle"),hn.show("Đã huỷ",{kind:"info",durationMs:1200})}onKeyDown=e=>{if(e.code!=="Escape")return;const t=e.target;t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)||(this._state==="pressing"||this._state==="armed"||this._state==="carrying")&&(e.preventDefault(),this.cancel())}}class Ex{el=null;rows=null;show(e,t,n){this.el||this.mount(),!(!this.el||!this.rows)&&(this.rows.x.textContent=ka(e),this.rows.y.textContent=ka(t),this.rows.z.textContent=ka(n),this.el.style.display="block")}hide(){this.el&&(this.el.style.display="none")}mount(){const e=document.createElement("div");e.id="dev-probe-panel",e.setAttribute("role","status"),e.setAttribute("aria-label","Dev probe toạ độ"),e.innerHTML=`
            <header>PROBE</header>
            <dl>
                <dt>X</dt><dd data-axis="x">—</dd>
                <dt>Y</dt><dd data-axis="y">—</dd>
                <dt>Z</dt><dd data-axis="z">—</dd>
            </dl>
            <footer>Đơn vị: m</footer>
        `,document.body.appendChild(e),this.el=e,this.rows={x:e.querySelector('[data-axis="x"]'),y:e.querySelector('[data-axis="y"]'),z:e.querySelector('[data-axis="z"]')}}}function ka(r){return r.toFixed(2)}class Tx{constructor(e,t,n,i=new URLSearchParams(window.location.search).get("develop")==="true"){this.host=e,this.hud=t,this.develop=i,this.vehicle=n??(new URLSearchParams(window.location.search).get("vehicle")==="2"?new ov:new ll),this.cameras=new _x(this.develop),this.cabin=new $_(this.host),this.scene.background=new Fe(10405092),this.scene.fog=new $o(10405092,55,135),this.renderer=new K_({antialias:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.host.appendChild(this.renderer.domElement),this.cameras.attach(this.renderer.domElement),this.scene.add(this.track.root,this.vehicle.root),this.scene.add(new Kf(14544639,5858119,2)),this.exam.wireExam04(this.track.wheelTrackCourseSensors),this.exam.wireExam05South(this.track),this.develop&&(this.probeCtrl=new yx(this.cameras.camera,this.track,this.renderer.domElement,this.devProbePanel,!0),this.roadEditor=new Mx(this.cameras.camera,this.renderer.domElement,this.track,!0),this.probeCtrl.setEditorActive(()=>this.roadEditor?.isActive??!1));const s=new qh(16777215,2.3);s.position.set(-20,35,18),s.castShadow=!0,s.shadow.mapSize.set(2048,2048),s.shadow.camera.left=-60,s.shadow.camera.right=60,s.shadow.camera.top=60,s.shadow.camera.bottom=-60,this.scene.add(s),window.addEventListener("resize",this.resize),this.resize(),this.hud.bind({onRestart:()=>this.restart(),onCamera:()=>{this.develop||this.cameras.next()},onAnalog:(a,o)=>this.input.setAnalog(a,o),onVirtual:(a,o)=>this.input.setVirtual(a,o),onSignalChange:a=>this.vehicle.setSignal(a),onSeatBelt:a=>this.vehicle.seatBeltFastened=a})}host;hud;develop;cabin;scene=new bh;renderer;input=new J_;vehicle;track=new Zv;exam=new gx;cameras;devProbePanel=new Ex;probeCtrl;roadEditor;clock=new np;animationId=0;stopped=!1;lastCameraKey=!1;probe=new E;wheelTmp=new E;start(){this.stopped=!1,this.clock.start();const e=()=>{if(this.stopped)return;this.animationId=requestAnimationFrame(e);const t=Math.min(this.clock.getDelta(),.033),n=performance.now();this.roadEditor&&this.roadEditor.tick(n);const i=this.input.isDown("KeyC");!this.develop&&i&&!this.lastCameraKey&&this.cameras.next(),this.lastCameraKey=i,this.vehicle.followSurface((u,g)=>this.track.getSurfaceHeight(u,g)),this.develop||this.vehicle.update(t,this.input),this.vehicle.followSurface((u,g)=>this.track.getSurfaceHeight(u,g)),this.track.update(t,this.vehicle.root.position);const s=this.exam.penalties.length,a=this.probe.set(0,0,-2.2).applyQuaternion(this.vehicle.root.quaternion).add(this.vehicle.root.position).clone(),o=this.vehicle instanceof Xr&&this.vehicle.wheelAssembly?{FL:this.vehicle.wheelAssembly.getWheel("FL").getWorldPosition(this.wheelTmp).clone(),FR:this.vehicle.wheelAssembly.getWheel("FR").getWorldPosition(this.wheelTmp).clone(),RL:this.vehicle.wheelAssembly.getWheel("RL").getWorldPosition(this.wheelTmp).clone(),RR:this.vehicle.wheelAssembly.getWheel("RR").getWorldPosition(this.wheelTmp).clone()}:void 0,l=this.exam.update({position:this.vehicle.root.position,frontPosition:a,wheelPositions:o,speedKmh:this.vehicle.getSpeedKmh(),rpm:this.vehicle.transmission.rpm,engineRunning:this.vehicle.transmission.running,stalled:this.vehicle.transmission.car.stalled,leftSignal:this.vehicle.signals.left,seatBeltFastened:this.vehicle.seatBeltFastened},this.track.startSignal?.phase??"idle",t),c=this.exam.penalties.slice(s);c.length&&this.hud.flash(c.map(u=>u.reason+" (−"+u.points+")").join(". "),"penalty"),this.handlePenalties();const h=this.exam.activeIndex,d=h===1&&!this.exam.isFinished,f=h===2&&!this.exam.isFinished;if(this.hud.updatePedestrianHud(this.exam.pedestrianExercise,d?a.x:null,d),h===1){const u=this.exam.pedestrianExercise.stopLineX-a.x,g=u>=0&&u<=.5?"VALID":u>.5?"TOO_EARLY":"OVER";this.track.setStopDistanceLabel(u,g,this.vehicle.root.position.x)}else this.track.setStopDistanceLabel(0,"HIDDEN",0);if(f){const g=this.exam.hillExercise.signedDistanceToStopLine(a),_=this.exam.hillExercise.rollbackM,p=this.exam.hillExercise.timeRemainingSec;this.hud.updateHillHud(this.exam.hillExercise,g,_,p,!0)}else h!==1&&this.hud.updateHillHud(void 0,void 0,0,void 0,!1);if(this.cameras.update(this.vehicle,t,this.input),this.hud.update({speedKmh:this.vehicle.getSpeedKmh(),gasPedal:this.vehicle.transmission.pedals.gas,brakePedal:this.vehicle.transmission.pedals.brake,gearWarnings:this.vehicle.transmission.car.warnings,engineStatus:this.vehicle.transmission.status,gear:this.vehicle.transmission.gear,clutch:this.vehicle.transmission.clutch,rpm:this.vehicle.transmission.rpm,steeringWheelAngle:this.vehicle.steeringSystem.steeringWheelAngle,steering:Dn.radToDeg(this.vehicle.steering),signals:{left:this.vehicle.signals.left,right:this.vehicle.signals.right,hazard:this.vehicle.signals.hazard},seatBelt:this.vehicle.seatBeltFastened,startLamp:this.exam.startLampOn,disqualified:this.exam.disqualified,disqualifyReason:this.exam.disqualifyReason,score:this.exam.score,elapsed:this.exam.elapsedSeconds,currentExercise:this.exam.currentExerciseTitle,penalties:this.exam.penalties,cameraMode:this.cameras.mode},this.exam.isFinished),l&&(l==="Bắt đầu thi"&&this.track.startSignal?.goGreenNow(),this.hud.flash(l,l.startsWith("Chào mừng")?{kind:"exam",durationMs:7e3}:"exam"),l==="Lệnh xuất phát"))try{speechSynthesis.cancel(),speechSynthesis.speak(new SpeechSynthesisUtterance("Xuất phát"))}catch{}this.cabin.render(this.renderer,this.scene,this.cameras.camera,this.vehicle,!this.develop&&this.cameras.mode===2)};e()}handlePenalties(){if(this.exam.approaching)return;const e=performance.now(),t=this.vehicle.root.position,n=[new E(-.95,0,1.25),new E(.95,0,1.25),new E(-.95,0,-1.3),new E(.95,0,-1.3)];for(const i of n){this.probe.copy(i).applyQuaternion(this.vehicle.root.quaternion).add(t);for(let s=0;s<this.track.penaltyZones.length;s++)if(this.track.penaltyZones[s].containsPoint(this.probe)){const a=this.exam.applyLinePenalty(s,e);a&&this.hud.flash(a.reason,"penalty")}}}restart(){this.vehicle.reset(),this.exam.reset(),this.track.reset(),this.input.clearVirtual(),this.hud.clearNotices(),this.hud.flash("Đã bắt đầu lại bài thi","exam")}resize=()=>{const e=this.host.clientWidth,t=this.host.clientHeight;this.renderer.setSize(e,t,!1),this.cameras.resize(e,t)}}class wx{context;oscillator;gain;constructor(e){const t=()=>{this.context||(this.context=new AudioContext,this.oscillator=this.context.createOscillator(),this.oscillator.type="triangle",this.gain=this.context.createGain(),this.gain.gain.value=0,this.oscillator.connect(this.gain).connect(this.context.destination),this.oscillator.start()),this.context.resume().catch(()=>{})};e.addEventListener("pointerdown",t),window.addEventListener("keydown",t),window.addEventListener("blur",()=>{this.context&&this.context.suspend()})}update(e){if(!this.context||!this.oscillator||!this.gain)return;const t=this.context.currentTime;this.oscillator.frequency.setTargetAtTime(Math.max(25,e/30),t,.08),this.gain.gain.setTargetAtTime(e>0?.015+Math.min(1,e/5500)*.045:0,t,.08)}}const nh="pedestrian-hud",bx={IDLE:"Đang chờ kích hoạt",APPROACHING:"Giảm tốc, dừng trước vạch · tối đa 0.5 m",STOP_EVAL:"Đang đánh giá vị trí dừng",VALID:"Vị trí dừng hợp lệ",TOO_EARLY:"Dừng quá xa vạch",OVER_LINE:"Đã vượt vạch dừng",DQ:"Đình chỉ sát hạch",DONE:"Hoàn thành bài 2"},Ax="VỊ TRÍ HỢP LỆ (0 ≤ A ≤ 0.5 m)",Rx="DỪNG QUÁ XA",Cx="VƯỢT VẠCH",Px="KHÔNG DỪNG TẠI VẠCH";function Lx(r){let e=document.getElementById(nh);return e||(e=document.createElement("div"),e.id=nh,e.innerHTML=`
            <div class="ped-card-title">
                <span class="ped-card-marker">2A</span>
                <div class="ped-card-titles">
                    <b class="ped-card-headline">Dừng xe nhường đường người đi bộ</b>
                    <small class="ped-card-sub" id="pedHint">Đang chờ kích hoạt</small>
                </div>
            </div>
            <div class="ped-card-row">
                <div class="ped-dist" id="pedDist">—</div>
                <div class="ped-dist-label" id="pedDistLabel">Chưa đo</div>
            </div>
            <div class="ped-badge" id="pedBadge">
                <span class="ped-badge-dot"></span>
                <span id="pedBadgeText">—</span>
            </div>
        `,r.appendChild(e)),{root:e,title:e.querySelector(".ped-card-headline"),hint:e.querySelector("#pedHint"),dist:e.querySelector("#pedDist"),distLabel:e.querySelector("#pedDistLabel"),badge:e.querySelector("#pedBadge"),badgeText:e.querySelector("#pedBadgeText")}}function Ix(r,e){if(r===null)return"IDLE";const t=e-r;return t>=0&&t<=.5?"VALID":t>.5?"TOO_EARLY":"OVER_LINE"}function Dx(r){return`A = ${r>=0?"+":"−"}${Math.abs(r).toFixed(2)} m`}const Nx={update(r,e,t,n){const i=Lx(r);if(!n||!e){i.root.style.display="none";return}i.root.style.display="";let s;e.state==="INACTIVE"?s="IDLE":e.state==="APPROACHING"?s="APPROACHING":e.state==="DISQUALIFIED"?s="DQ":e.state==="COMPLETED"?s="DONE":s="STOP_EVAL";let a="—",o="none";if(e.stopClassification)switch(e.stopClassification){case"VALID_STOP":a=Ax,o="valid",s="VALID";break;case"STOP_TOO_EARLY":a=Rx,o="early",s="TOO_EARLY";break;case"STOP_OVER_LINE":a=Cx,o="over",s="OVER_LINE";break;case"NO_REQUIRED_STOP":a=Px,o="no-stop",s="OVER_LINE";break}else s==="DQ"?(a="ĐÌNH CHỈ SÁT HẠCH",o="dq"):s==="DONE"&&(a="HOÀN THÀNH",o="done");if(i.hint.textContent=bx[s]??"",t===null||s==="IDLE")i.dist.textContent="—",i.distLabel.textContent="Chưa đo",i.dist.dataset.kind="";else{const l=e.stopLineX-t;i.dist.textContent=Dx(l);const c=Ix(t,e.stopLineX),h={IDLE:"",APPROACHING:"approach",STOP_EVAL:"approach",TOO_EARLY:"early",OVER_LINE:"over",VALID:"valid",DQ:"over",DONE:"done"};i.dist.dataset.kind=h[c],i.distLabel.textContent=c==="VALID"?"Cách vạch hợp lệ":c==="TOO_EARLY"?"Cần tiến gần hơn":c==="OVER_LINE"?"Đã qua vạch":c==="APPROACHING"?"Đang tiếp cận vạch":""}i.badge.dataset.kind=o,i.badgeText.textContent=a,i.title.textContent=e.title??"Bài 2A"}},ih="hill-hud",Ox={IDLE:"Đang chờ kích hoạt",APPROACHING:"Lên dốc · dừng tại vạch · tối đa 0.5 m",STOP_EVAL:"Đang đánh giá vị trí dừng",VALID:"Vị trí dừng hợp lệ · chuẩn bị khởi hành",TOO_EARLY:"Dừng quá xa vạch",OVER_LINE:"Đã vượt vạch dừng",HILL_STARTING:"Khởi hành lên dốc · không tụt quá 0.5 m",DQ:"Đình chỉ sát hạch",DONE:"Hoàn thành bài 3"},Ux="VỊ TRÍ HỢP LỆ (0 ≤ A ≤ 0.5 m)",Fx="DỪNG QUÁ XA (−5 điểm)",Bx="VƯỢT VẠCH",kx="KHÔNG DỪNG TẠI VẠCH";function Hx(r){let e=document.getElementById(ih);return e||(e=document.createElement("div"),e.id=ih,e.innerHTML=`
            <div class="ped-card-title">
                <span class="ped-card-marker">3A</span>
                <div class="ped-card-titles">
                    <b class="ped-card-headline">Dừng và khởi hành xe ngang dốc</b>
                    <small class="ped-card-sub" id="hillHint">Đang chờ kích hoạt</small>
                </div>
            </div>
            <div class="ped-card-row">
                <div class="ped-dist" id="hillDist">—</div>
                <div class="ped-dist-label" id="hillDistLabel">Chưa đo</div>
            </div>
            <div class="hill-card-row">
                <div class="hill-rollback" id="hillRollback">0.00 m</div>
                <div class="hill-rollback-label">Tụt dốc</div>
                <div class="hill-timer" id="hillTimer">—</div>
                <div class="hill-timer-label">Giây còn lại</div>
            </div>
            <div class="ped-badge" id="hillBadge">
                <span class="ped-badge-dot"></span>
                <span id="hillBadgeText">—</span>
            </div>
        `,r.appendChild(e)),{root:e,title:e.querySelector(".ped-card-headline"),hint:e.querySelector("#hillHint"),dist:e.querySelector("#hillDist"),distLabel:e.querySelector("#hillDistLabel"),rollback:e.querySelector("#hillRollback"),rollbackLabel:e.querySelector(".hill-rollback-label"),timer:e.querySelector("#hillTimer"),timerLabel:e.querySelector(".hill-timer-label"),badge:e.querySelector("#hillBadge"),badgeText:e.querySelector("#hillBadgeText")}}function zx(r){return`A = ${r>=0?"+":"−"}${Math.abs(r).toFixed(2)} m`}function Vx(r){return`${r.toFixed(2)} m`}function Gx(r){return r===void 0?"—":`${Math.ceil(r)} s`}const Wx={update(r,e,t,n,i,s){const a=Hx(r);if(!s||!e){a.root.style.display="none";return}a.root.style.display="";let o;e.state==="INACTIVE"?o="IDLE":e.state==="APPROACHING_STOP_LINE"?o="APPROACHING":e.state==="STOP_EVALUATION"?o="STOP_EVAL":e.state==="HILL_STARTING"||e.state==="START_COMPLETED"||e.state==="LEAVE_HILL"?o="HILL_STARTING":e.state==="DISQUALIFIED"?o="DQ":e.state==="COMPLETED"?o="DONE":o="IDLE";let l="—",c="none";if(e.stopClassification)switch(e.stopClassification){case"VALID_STOP":l=Ux,c="valid",o="VALID";break;case"STOP_TOO_EARLY":l=Fx,c="early",o="TOO_EARLY";break;case"STOP_OVER_LINE":l=Bx,c="over",o="OVER_LINE";break;case"NO_REQUIRED_STOP":l=kx,c="no-stop",o="OVER_LINE";break}else o==="DQ"?(l="ĐÌNH CHỈ SÁT HẠCH",c="dq"):o==="DONE"?(l="HOÀN THÀNH",c="done"):o==="HILL_STARTING"&&(l="ĐANG KHỞI HÀNH",c="valid");if(a.hint.textContent=Ox[o]??"",t===void 0||o==="IDLE")a.dist.textContent="—",a.distLabel.textContent="Chưa đo",a.dist.dataset.kind="";else{a.dist.textContent=zx(t);const d=t>=0&&t<=.5?"VALID":t>.5?"TOO_EARLY":"OVER_LINE",f={VALID:"valid",TOO_EARLY:"early",OVER_LINE:"over"};a.dist.dataset.kind=f[d]??"",a.distLabel.textContent=d==="VALID"?"Cách vạch hợp lệ":d==="TOO_EARLY"?"Cần tiến gần hơn":d==="OVER_LINE"?"Đã qua vạch":""}a.rollback.textContent=Vx(n);const h=n>.5?"early":n>.2?"approach":"";if(a.rollback.dataset.kind=h,a.timer.textContent=Gx(i),i!==void 0){const d=i<=5?"early":i<=10?"approach":"";a.timer.dataset.kind=d}else a.timer.dataset.kind="";a.badge.dataset.kind=c,a.badgeText.textContent=l,a.title.textContent=e.title??"Bài 3A"}};class Xx{constructor(e,t={}){this.host=e,this.options=t,this.audio=new wx(e),t.develop&&e.classList.add("develop-mode"),this.host.innerHTML=`
            <header class="telemetry">
                ${t.develop?'<section class="pill develop-pill">DEVELOP</section>':""}
                <section class="pill"><span class="mint icon">♢</span><strong id="score">100</strong><i></i><span class="mint">◴</span><b class="mint mono" id="time">00:00</b></section>
                <section class="pill exercise"><span class="blue">◎</span><b id="exercise">Xuất phát</b><small id="penalty">0 lỗi</small><span id="startLamp" class="start-lamp" title="Đèn lệnh xuất phát">GO</span></section>
                <section class="pill"><strong id="speed">0</strong><small class="blue">KM/H</small><i></i><span class="amber">ϟ</span><b class="amber" id="rpm">0</b><small class="amber">RPM</small><i></i><button id="engine" data-key="Enter" class="engine" aria-label="Bật hoặc tắt động cơ">ENGINE</button></section>
            </header>
            <details class="settings"><summary>⚙ &nbsp; CÀI ĐẶT & GÓC NHÌN</summary><div class="settings-body">
                <button id="cameraBtn">Đổi camera</button><button id="restartBtn">Thi lại</button>
                <p>Enter: bật/tắt máy<br>Shift: đạp côn · F: nhả nhanh · N/R/1–5: số<br>W/↑: ga · S/↓: phanh<br>A/D: lái · Space: thắng · C: camera${t.develop?"<br>Chuột phải kéo nhìn · WASD di chuyển · Q/E lên xuống · Shift nhanh<br>P probe toạ độ · Edit Road: giữ 2s trên road để nâng · Esc huỷ":""}</p>
            </div></details>
            <div class="cockpit">
                <div class="clutch-column"><button id="quickCamera" class="camera-toggle" aria-label="Đổi camera">▣ <span id="camera">1</span></button>
                    <div class="pedal clutch"><b>CÔN</b><span class="clutch-scale"><input class="analog-clutch" type="range" min="0" max="1" step="0.01" value="1" aria-label="Mức nhả côn" aria-describedby="clutchHelp" data-analog="clutch"></span><small id="clutchHelp">Giữ <kbd>Shift</kbd> để đạp</small></div>
                </div>
                <div class="signal-cluster" role="group" aria-label="Xi nhan và đèn cảnh báo nguy hiểm">
                    <div class="signal-readout" aria-hidden="true">
                        <div class="signal-led signal-led-left"></div>
                        <div class="signal-led signal-led-hazard"></div>
                        <div class="signal-led signal-led-right"></div>
                    </div>
                    <button id="seatBelt" class="seat-belt" aria-label="Dây an toàn (phím B)" aria-pressed="false">DÂY B</button>
                    <div class="signal-stalks">
                        <button id="signalLeft" class="signal-stalk signal-stalk-left" data-signal="left" aria-label="Xi nhan trái (phím Q)" aria-pressed="false"><span class="signal-arrow">⟵</span><kbd>Q</kbd></button>
                        <button id="signalHazard" class="signal-stalk signal-stalk-hazard" data-signal="hazard" aria-label="Cảnh báo nguy hiểm (phím H)" aria-pressed="false"><span class="signal-tri">△</span><kbd>H</kbd></button>
                        <button id="signalRight" class="signal-stalk signal-stalk-right" data-signal="right" aria-label="Xi nhan phải (phím E)" aria-pressed="false"><span class="signal-arrow">⟶</span><kbd>E</kbd></button>
                    </div>
                </div>
                <div class="wheel-control"><div id="wheel" class="steering-wheel" role="slider" tabindex="0" aria-label="Vô lăng — kéo để lái, phím trái phải để điều chỉnh" aria-valuemin="-540" aria-valuemax="540" aria-valuenow="0"><svg id="wheelFace" viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="99" fill="none" stroke="#111820" stroke-width="27"/><circle cx="120" cy="120" r="99" fill="none" stroke="#87909c" stroke-width="2"/><path d="M29 95 L99 107 L105 133 L39 132 M211 95 L141 107 L135 133 L201 132 M107 137 L103 214 L137 214 L133 137" fill="#47515f" stroke="#a2aab6" stroke-width="2"/><circle cx="120" cy="120" r="34" fill="#202b38" stroke="#697786" stroke-width="2"/><path d="M112 120h16" stroke="#a7bccd" stroke-width="3"/><path d="M120 12v18" stroke="#edc864" stroke-width="6"/></svg></div><small id="steering">0°</small></div>
                <div class="drive-column"><details class="gear-selector"><summary><span id="gear">N</span> ⌃</summary><div class="gear-options">${[["KeyR","R"],["KeyN","N"],...Array.from({length:5},(n,i)=>["Digit"+(i+1),String(i+1)])].map(([n,i])=>`<button data-key="${n}" aria-label="Chọn số ${i}">${i}</button>`).join("")}<small>Giữ côn để sang số</small></div></details>
                    <label class="fine-gas">Chỉnh mức ga <input type="range" min="0" max="1" step="0.01" value="0" data-analog="gas" aria-label="Mức ga"></label><div class="pedals"><button data-key="ArrowDown" class="pedal brake" aria-label="Giữ để phanh"><b>PHANH</b><span class="pedal-meter"><span id="brakeFill"></span></span><small id="brakeValue">0%</small><kbd>S / ↓</kbd></button><button data-key="ArrowUp" class="pedal gas" aria-label="Giữ để đạp ga"><b>⌃ GA</b><span class="pedal-meter gas-meter"><span id="gasFill"></span></span><small id="gasValue">Nhả ga</small><kbd>W / ↑</kbd></button></div>
                </div>
            </div>`,this.host.querySelectorAll("[id]").forEach(n=>this.elements.set(n.id,n))}host;options;audio;restart=()=>{};lastGear="";lastExercise="";status="";finishedShown=!1;clutchDragging=!1;signalState={left:!1,right:!1,hazard:!1};elements=new Map;el(e){return this.elements.get(e)}bind(e){this.restart=e.onRestart;const t=this.el("wheel");let n=null,i=0,s=0;const a=u=>{const g=t.getBoundingClientRect();return Math.atan2(u.clientY-g.top-g.height/2,u.clientX-g.left-g.width/2)},o=()=>{e.onAnalog("steeringActive",1),e.onAnalog("steering",.5+s/(Math.PI*6))},l=()=>{n=null,e.onAnalog("steeringActive",0)};t.addEventListener("pointerdown",u=>{n===null&&(u.preventDefault(),n=u.pointerId,i=a(u),s=Number(t.getAttribute("aria-valuenow"))*Math.PI/180,o(),t.setPointerCapture(u.pointerId))}),t.addEventListener("pointermove",u=>{if(n!==u.pointerId)return;const g=a(u),_=Math.atan2(Math.sin(g-i),Math.cos(g-i));s=Math.max(-3*Math.PI,Math.min(3*Math.PI,s+_)),i=g,o()}),t.addEventListener("pointerup",u=>{n===u.pointerId&&l()}),t.addEventListener("pointercancel",l),t.addEventListener("lostpointercapture",l),t.addEventListener("keydown",u=>{["ArrowLeft","ArrowRight","Home"].includes(u.code)&&(u.preventDefault(),s=u.code==="Home"?0:Math.max(-3*Math.PI,Math.min(3*Math.PI,s+(u.code==="ArrowLeft"?-.2:.2))),o())}),t.addEventListener("keyup",l),t.addEventListener("blur",l),window.addEventListener("blur",l),this.host.querySelectorAll("[data-analog]").forEach(u=>{if(u.addEventListener("input",()=>e.onAnalog(u.dataset.analog,u.dataset.analog==="clutch"?1-Number(u.value):Number(u.value))),u.dataset.analog==="clutch"){const g=()=>{this.clutchDragging=!1,e.onAnalog("clutch",0)};u.addEventListener("pointerdown",_=>{this.clutchDragging=!0,u.setPointerCapture(_.pointerId)}),u.addEventListener("pointerup",g),u.addEventListener("pointercancel",g),u.addEventListener("lostpointercapture",g),u.addEventListener("keydown",()=>{this.clutchDragging=!0}),u.addEventListener("keyup",g),u.addEventListener("blur",g),window.addEventListener("blur",g)}window.addEventListener("blur",()=>{u.value=u.dataset.analog==="clutch"?"1":"0",e.onAnalog(u.dataset.analog,0)})}),this.el("restartBtn").addEventListener("click",e.onRestart),this.el("cameraBtn").addEventListener("click",e.onCamera),this.el("quickCamera").addEventListener("click",e.onCamera),this.host.querySelectorAll("[data-key]").forEach(u=>{const g=u.dataset.key,_=()=>{e.onVirtual(g,!1),u.classList.remove("pressed")};u.addEventListener("pointerdown",p=>{p.preventDefault(),u.setPointerCapture(p.pointerId),e.onVirtual(g,!0),u.classList.add("pressed")}),u.addEventListener("pointerup",_),u.addEventListener("pointercancel",_),u.addEventListener("lostpointercapture",_),u.addEventListener("keydown",p=>{p.code==="Space"&&(p.preventDefault(),e.onVirtual(g,!0),u.classList.add("pressed"))}),u.addEventListener("keyup",p=>{p.code==="Space"&&(p.preventDefault(),_())}),u.addEventListener("blur",_),window.addEventListener("blur",_)});const c={KeyQ:"left",KeyE:"right",KeyH:"hazard"},h=u=>{this.signalState=u,this.el("signalLeft").classList.toggle("active",u.left),this.el("signalLeft").setAttribute("aria-pressed",String(u.left)),this.el("signalRight").classList.toggle("active",u.right),this.el("signalRight").setAttribute("aria-pressed",String(u.right)),this.el("signalHazard").classList.toggle("active",u.hazard),this.el("signalHazard").setAttribute("aria-pressed",String(u.hazard)),e.onSignalChange({...u})},d=u=>{const g={...this.signalState};u==="hazard"?(g.hazard=!g.hazard,g.hazard&&(g.left=!1,g.right=!1)):(g.hazard=!1,u==="left"?(g.left=!g.left,g.left&&(g.right=!1)):(g.right=!g.right,g.right&&(g.left=!1))),h(g)};this.host.querySelectorAll("[data-signal]").forEach(u=>{const g=u.dataset.signal;u.addEventListener("click",_=>{_.preventDefault(),d(g)})});const f=u=>{this.el("seatBelt").classList.toggle("active",u),this.el("seatBelt").setAttribute("aria-pressed",String(u)),e.onSeatBelt(u)};this.el("seatBelt").addEventListener("click",u=>{u.preventDefault(),f(this.el("seatBelt").getAttribute("aria-pressed")!=="true")}),window.addEventListener("keydown",u=>{if(u.repeat)return;const g=c[u.code];if(!g)return;const _=u.target;_&&(_.tagName==="INPUT"||_.tagName==="TEXTAREA")||(u.preventDefault(),d(g))}),window.addEventListener("keydown",u=>{if(u.repeat||u.code!=="KeyB")return;const g=u.target;g&&(g.tagName==="INPUT"||g.tagName==="TEXTAREA")||(u.preventDefault(),f(this.el("seatBelt").getAttribute("aria-pressed")!=="true"))})}update(e,t){this.audio.update(e.rpm),this.el("gasFill").style.height=e.gasPedal*100+"%",this.el("brakeFill").style.height=e.brakePedal*100+"%",this.el("gasValue").textContent=e.gasPedal<.001?"Nhả ga":e.gasPedal<=1/3?"Ga nhẹ":e.gasPedal<=2/3?"Ga vừa":"Ga mạnh",this.el("brakeValue").textContent=Math.round(e.brakePedal*100)+"%";const n=e.gearWarnings,i=n.includes("RECOMMEND_SHIFT_DOWN")?"Số cao, tốc độ thấp — nên về số "+Math.max(1,e.gear-1):n.includes("RECOMMEND_SHIFT_UP")?"Nên chuyển số "+(e.gear+1):n.includes("LOW_GEAR_HIGH_SPEED")?"Vòng tua cao — giảm ga":"";i&&i!==this.lastGear&&this.flash(i,"warning"),this.lastGear=i,this.el("speed").textContent=String(Math.round(e.speedKmh)),this.el("score").textContent=String(e.score),this.el("time").textContent=`${Math.floor(e.elapsed/60).toString().padStart(2,"0")}:${Math.floor(e.elapsed%60).toString().padStart(2,"0")}`,this.el("exercise").textContent=e.currentExercise;const s=e.currentExercise.split(" · ")[0];s&&s!==this.lastExercise&&(this.lastExercise=s,s!=="Chuẩn bị"&&this.flash(`Vào bài: ${s}`,"exam")),this.el("penalty").textContent=`${e.penalties.length} lỗi`,this.el("rpm").textContent=String(e.rpm),this.el("engine").classList.toggle("running",e.rpm>0),this.el("engine").setAttribute("aria-pressed",String(e.rpm>0)),this.el("engine").title=e.engineStatus+" · Enter",this.el("gear").textContent=e.gear===0?"N":e.gear===-1?"R":String(e.gear),this.clutchDragging||(this.host.querySelector('[data-analog="clutch"]').value=String(1-e.clutch)),this.el("steering").textContent=`${Math.round(e.steering)}°`,this.el("wheelFace").style.transform=`rotate(${e.steeringWheelAngle}deg)`,this.el("wheel").setAttribute("aria-valuenow",String(Math.round(e.steeringWheelAngle))),this.el("camera").textContent=this.options.develop?"Dev":e.cameraMode===2?"Cabin":String(e.cameraMode+1),this.el("cameraBtn").textContent=this.options.develop?"Camera tự do":"Đổi camera · "+["Chéo","Trên cao","Cabin"][e.cameraMode];const a=e.signals??{left:!1,right:!1,hazard:!1};this.host.querySelector(".signal-led-left").classList.toggle("led-on",a.left),this.host.querySelector(".signal-led-right").classList.toggle("led-on",a.right),this.host.querySelector(".signal-led-hazard").classList.toggle("led-on",a.hazard),this.el("seatBelt").classList.toggle("active",e.seatBelt),this.el("seatBelt").setAttribute("aria-pressed",String(e.seatBelt)),this.el("startLamp").classList.toggle("on",e.startLamp),this.status!==e.engineStatus&&(this.status=e.engineStatus,this.flash(e.engineStatus,"info")),t?this.finishedShown||(this.finishedShown=!0,e.disqualified?hn.showDisqualify(e.score,e.disqualifyReason||"Đình chỉ sát hạch",this.restart):this.flash(`Hoàn thành · ${e.score} điểm`,{kind:"success",persist:!0})):this.finishedShown=!1}flash(e,t="info"){hn.show(e,typeof t=="string"?{kind:t}:t)}updatePedestrianHud(e,t,n){Nx.update(this.host,e,t,n)}updateHillHud(e,t,n,i,s){Wx.update(this.host,e,t,n,i,s)}clearNotices(){this.finishedShown=!1,this.lastGear="",this.lastExercise="",this.status="",hn.clear()}}const Bo=document.querySelector("#game"),id=document.querySelector("#hud");if(!Bo||!id)throw new Error("Missing host");const qx=new URLSearchParams(window.location.search).get("develop")==="true",Yx=new Xx(id,{develop:qx});async function Kx(){try{const r=new URLSearchParams(window.location.search).get("vehicle")==="3",[e]=await Promise.all([r?Xr.create():Promise.resolve(void 0),Dr.preload()]);new Tx(Bo,Yx,e).start()}catch(r){console.error("Unable to start game",r),Bo.textContent="Không tải được xe 3D. Vui lòng tải lại trang hoặc kiểm tra file GLB."}}Kx();
