# Getting started with Banjo

!!! abstract "In this guide, you'll go from a new directory to the `quick start` example Banjo project"

## Project setup

```shell
bun init
bun add @studiokeywi/banjo
```

Here are some boilerplate files to get the project started -- a simple HTML page, our "game" logic, and a "server" file using Bun:

!!! info "Changed lines for each file will be highlighted in each step"

=== "index.html"

    ```html linenums="1" hl_lines="1-17"
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Banjo Project</title>
        <style>
          body,
          html {
            height: 100%;
            margin: 0px;
          }
        </style>
        <script type="module" defer src="./game.ts"></script>
      </head>
      <body></body>
    </html>
    ```

=== "game.ts"

    ```typescript linenums="1" hl_lines="1"
    console.log('Hello world!');
    ```

=== "index.ts"

    ```typescript linenums="1" hl_lines="1-9 11"
    const server = Bun.serve({
      async fetch({ url }) {
        if (new URL(url).pathname === '/game.ts') {
          const [body] = (await Bun.build({ entrypoints: ['./game.ts'] })).outputs;
          return new Response(body);
        }
        return new Response(Bun.file('./index.html'));
      },
    });

    console.log(`Now listening on http://${server.hostname}:${server.port}\n${'-'.repeat(25 + server.hostname.length + server.port.toString().length)}`);
    ```

You should now be able to run:

```shell
bun .
```

And see something similar to

```shell
Now listening on http://localhost:3000
--------------------------------------
```

Pointing your browser to that address, you should see a blank page with your "Hello world!" printed in the DevTools console.

## `createEngine`

Now that you have a working skeleton, you can start using Banjo features. Let's start with creating a simple engine by updating your project files:

=== "index.html"

    ```html linenums="1" hl_lines="13-18 22-24"
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Banjo Project</title>
        <style>
          body,
          html {
            height: 100%;
            margin: 0px;
          }
          #debugHUD {
            left: 8px;
            font-size: 3rem;
            position: absolute;
            top: 8px;
          }
        </style>
        <script type="module" defer src="./game.ts"></script>
      </head>
      <body>
        <div id="debugHUD"></div>
      </body>
    </html>
    ```

=== "game.ts"

    ```typescript linenums="1" hl_lines="1 3-5 7-15"
    import { createEngine } from '@studiokeywi/banjo/engine';

    const hud = document.querySelector<HTMLDivElement>('#debugHUD')!;
    let FPS: number;
    let TPS: number;

    const engine = createEngine({
      TPS: 60, // (1)!
      render: () => { // (2)!
        hud.innerText = `Engine TPS: ${TPS} | Engine FPS: ${FPS}`;
      },
      update: () => { // (3)!
        ({ FPS, TPS } = engine); // (4)!
      },
    });
    ```

    1. The Ticks Per Second (or `TPS`) is a measure of how often you want your game logic to run
    2. The `render` function will get called approximately as many times per second as the user's monitor refresh rate
    3. The `update` function will get called approximately as many times per second as defined in `TPS`
    4. The `Engine` interface exposes the approximate FPS and TPS for quick access like this

=== "index.ts"

    ```typescript linenums="1" hl_lines="3-4 8-10"
    --8<-- "examples/quick-start/server.ts"
    ```

!!! question "IntelliSense doesn't recognize DOM types like `document`?"

    Try adding the `"DOM"` value to your `tsconfig.json` in the `lib` property under `compilerOptions`:

    ```json
    {
      "compilerOptions": {
        "lib": ["DOM"] // (1)!
      }
    }
    ```

    1. While not required, we suggest a minimum `lib` setting of `["DOM", "DOM.AsyncIterable", "DOM.Iterable", "ESNext"]`

Under the hood, Banjo's game loop utilizes `requestAnimationFrame`. This means we can attempt to target the user's monitor refresh rate for maximum FPS, and provide developers with a customizable target for game ticks (or updates) per second. Both the `render` and `update` functions are passed a `delta` value in milliseconds.

### The `render` function

The render function should handle whatever logic your game requires to display the game. This could involve using the `<canvas>` element, manipulating DOM elements, or more based on your project structure. For now, we'll create a simple HUD using a `<div>` to render engine data.

!!! tip "`render` is passed a `delta` value representing the elapsed time since the last frame

### The `update` function

The update function should handle whatever logic is required to change the state of the game. For now, we'll use it to grab the current engine state.

!!! tip "`update` is passed a `delta` value equal to `1 / (TPS * 1_000)` (the duration of one "tick" based on the provided TPS value, converted to milliseconds)"

## Running the engine

If you have been running your code after each change (or using Bun's `--watch` mode to restart automatically), you'll notice that nothing is actually updating on the page. This is because the engine needs to be started first. We advise using patterns to start, stop, or pause/unpause the engine based on browser ready state and whether it has focus:

=== "index.html"

    ```html linenums="1"
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Banjo Project</title>
        <style>
          body,
          html {
            height: 100%;
            margin: 0px;
          }
          #debugHUD {
            left: 8px;
            font-size: 3rem;
            position: absolute;
            top: 8px;
          }
        </style>
        <script type="module" defer src="./game.ts"></script>
      </head>
      <body>
        <div id="debugHUD"></div>
      </body>
    </html>
    ```

=== "game.ts"

    ```typescript linenums="1" hl_lines="3-12 28-34 36-42"
    import { createEngine } from '@studiokeywi/banjo/engine';

    const pause = () => { // (1)!
      if (!engine.paused) {
        engine.pause();
      }
    };
    const unpause = () => {
      if (engine.paused) {
        engine.pause();
      }
    };

    const hud = document.querySelector<HTMLDivElement>('#debugHUD')!;
    let FPS: number;
    let TPS: number;

    const engine = createEngine({
      TPS: 60,
      render: () => {
        hud.innerText = `Engine TPS: ${TPS} | Engine FPS: ${FPS}`;
      },
      update: () => {
        ({ FPS, TPS } = engine);
      },
    });

    addEventListener('beforeunload', () => {
      engine.stop();
      removeEventListener('blur', pause);
      removeEventListener('focus', unpause);
    });
    addEventListener('blur', pause);
    addEventListener('focus', unpause);

    if (document.readyState === 'complete') {
      engine.start();
    } else {
      addEventListener('load', () => {
        engine.start();
      });
    }
    ```

    1. The `pause` and `unpause` helpers here exist to make sure that we don't alter the pause state incorrectly (although that shouldn't happen in this example)

=== "index.ts"

    ```typescript linenums="1"
    --8<-- "examples/quick-start/server.ts"
    ```

### What about pausing?

Pausing the engine does not stop its internal loop; it only prevents the update and render callbacks from being executed. So you may be wondering how you can detect/display the paused state of the engine from outside of the render and update loops? This seems like a good use case for a `Watcher`:

!!! warning "This usage of a `Watcher` operates outside of the normal engine update cycle. This should not be used for logic that affects the game state directly"

=== "index.html"

    ```html linenums="1"
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Banjo Project</title>
        <style>
          body,
          html {
            height: 100%;
            margin: 0px;
          }
          #debugHUD {
            left: 8px;
            font-size: 3rem;
            position: absolute;
            top: 8px;
          }
        </style>
        <script type="module" defer src="./game.ts"></script>
      </head>
      <body>
        <div id="debugHUD"></div>
      </body>
    </html>
    ```

=== "game.ts"

    ```typescript linenums="1" hl_lines="2 16-22 33-35 41"
    import { createEngine } from '@studiokeywi/banjo/engine';
    import { createWatcher } from '@studiokeywi/banjo/watcher';

    const pause = () => {
      if (!engine.paused) {
        engine.pause();
      }
    };
    const unpause = () => {
      if (engine.paused) {
        engine.pause();
      }
    };

    const hud = document.querySelector<HTMLDivElement>('#debugHUD')!;
    const isPaused = createWatcher({
      do: () => { // (1)!
        if (engine.paused && !hud.innerText.includes('Paused')) {
          hud.innerText += ' | Paused';
        }
      }
    });
    let FPS: number;
    let TPS: number;

    const engine = createEngine({
      TPS: 60,
      render: () => {
        hud.innerText = `Engine TPS: ${TPS} | Engine FPS: ${FPS}`;
      },
      update: () => {
        ({ FPS, TPS } = engine);
        if (!isPaused.running) {
          isPaused.start(); // (2)!
        }
      },
    });

    addEventListener('beforeunload', () => {
      engine.stop();
      isPaused.stop();
      removeEventListener('blur', pause);
      removeEventListener('focus', unpause);
    });
    addEventListener('blur', pause);
    addEventListener('focus', unpause);

    if (document.readyState === 'complete') {
      engine.start();
    } else {
      addEventListener('load', () => {
        engine.start();
      });
    }
    ```

    1. The `Watcher` object performs behaviors based on configurable conditions and timings. Here, we want the `Watcher` to `do` our update for the pause display.
    2. `Watcher` objects run for a set period of time before stopping, and so this will restart the watcher automatically as needed.

=== "index.ts"

    ```typescript linenums="1"
    --8<-- "examples/quick-start/server.ts"
    ```

## Final touches

While technically a full Banjo project, this is still a little... basic. Our final step for this guide will be introducing a "bouncing ball" animation. It's still pretty simple, but it shows how easily Banjo features can be combined to obtain desired behavior:

=== "index.html"

    ```html linenums="1" hl_lines="19-26 31"
    --8<-- "examples/quick-start/index.html"
    ```

=== "game.ts"

    ```typescript linenums="1" hl_lines="2-4 29-36 40 42-43 50-58"
    --8<-- "examples/quick-start/game.ts"
    ```

=== "index.ts"

    ```typescript linenums="1"
    --8<-- "examples/quick-start/server.ts"
    ```

## Live Demo

<iframe style="height:60vh;" width="100%" srcdoc="<style>body,html{height:100%;margin:0px;}#debugHUD{left:8px;font-size:3rem;position:absolute;top:8px;}#ball{background:blue;border:solid 0px transparent;border-radius:1rem;height:16px;position:absolute;width:16px;}</style><div id=&quot;ball&quot;></div><div id=&quot;debugHUD&quot;></div><script>var MZ={milliseconds:{milliseconds:1,seconds:0.001,minutes:0.000016666666666666667,hours:0.00000027777777777777776,days:0.000000011574074074074074},seconds:{milliseconds:1000,seconds:1,minutes:0.016666666666666666,hours:0.0002777777777777778,days:0.000011574074074074073},minutes:{milliseconds:60000,seconds:60,minutes:1,hours:0.016666666666666666,days:0.0006944444444444445},hours:{milliseconds:3600000,seconds:3600,minutes:60,hours:1,days:0.041666666666666664},days:{milliseconds:86400000,seconds:86400,minutes:1440,hours:24,days:1}},q=(Z)=>{let W=Z.split(&quot; &quot;),z=+W[0],_=W[1],{milliseconds:J,seconds:G,minutes:Q,hours:j,days:K}=MZ[_],Y=Object.defineProperties({},{milliseconds:{enumerable:!0,value:z*J},seconds:{enumerable:!0,value:z*G},minutes:{enumerable:!0,value:z*Q},hours:{enumerable:!0,value:z*j},days:{enumerable:!0,value:z*K},as:{enumerable:!0,value:(M)=>q(`${Y[M]} ${M}`)},toString:{enumerable:!0,value:()=>Z},valueOf:{enumerable:!0,value:()=>z}});return Y},S=(Z)=>q(`${Z} milliseconds`),u=(Z)=>q(`${Z} seconds`);var d=()=>{let Z=new EventTarget;return{emit(z){return Z.dispatchEvent(z),this},off(z,_){return Z.removeEventListener(z,_),this},on(z,_){return Z.addEventListener(z,_),this},once(z,_){return Z.addEventListener(z,_,{once:!0}),this},set(z){let _;for(_ in z)Z.addEventListener(_,z[_]);return this}}};var bZ=new Error(&apos;Only one of &quot;onRise&quot; and &quot;onFall&quot; may be specified at a time&apos;),fZ=new Error(&apos;A non-zero positive value must be provided to &quot;debounce&quot;&apos;),kZ=new Error(&apos;One of &quot;onRise&quot; or &quot;onFall&quot; must be provided with a truthy value&apos;),yZ=new Error(&apos;A function must be provided to &quot;debounce&quot;&apos;);var IZ=new Error(&apos;A function must be provided to &quot;throttle&quot;&apos;),b=(Z,W)=>{if(typeof Z!==&quot;function&quot;)throw IZ;let z=W.milliseconds,_=()=>{J=0},J,G;return(...Q)=>{if(!J)G=Z(...Q),J=setTimeout(_,z);return G}};var FZ=({action:Z,allActions:W,emitter:z,key:_,pressed:J,type:G})=>{if(!D(J,_))return;let Q=W.get(Z);if(G===&quot;keydown&quot;)if(Q.state===0)Q.state=1,z.emit(new o({action:Z,key:_}));else Q.state=2,z.emit(new i({action:Z,key:_}));if(G===&quot;keyup&quot;)Q.state=0,z.emit(new n({action:Z,key:_}))},AZ=({allActions:Z,allBinds:W,allSequences:z,emitter:_})=>{return(J)=>{let G={altKey:J.altKey,code:J.code,ctrlKey:J.ctrlKey,key:J.key,metaKey:J.metaKey,shiftKey:J.shiftKey};for(let[Q,j]of W)FZ({action:j,allActions:Z,emitter:_,key:Q,pressed:G,type:J.type});if(J.type!==&quot;keyup&quot;)return;for(let[Q,j]of z)wZ({data:j,emitter:_,pressed:G,sequence:Q})}},k=(Z,W)=>Z/W*100,f=(Z,W,z)=>{z.emit(new e({progress:k(Z.progress.length,Z.keys.length),sequence:W})),l(Z)},D=(Z,W)=>{for(let z in W)if(W[z]!==Z[z])return!1;return!0},l=(Z)=>{Z.progress.splice(0,Z.progress.length),clearTimeout(Z.decaying),Z.decaying=null},wZ=({data:Z,emitter:W,pressed:z,sequence:_})=>{let{keys:J,keys:{length:G},progress:Q,progress:{length:j}}=Z;if(!J.some((Y)=>D(z,Y))){if(j)f(Z,_,W);return}let K=J[j];if(!D(z,K)){f(Z,_,W);return}if(Q.push(z),Q.length===G){W.emit(new t({key:z,sequence:_})),l(Z);return}W.emit(new ZZ({key:z,progress:k(Q.length,G),sequence:_})),clearTimeout(Z.decaying),Z.decaying=setTimeout(f,Z.decay,Z,_,W)},s=(Z,W)=>{let z=new Map,_=new Map,J=new Map,G=!1,Q=AZ({allActions:z,allBinds:_,allSequences:J,emitter:Z}),j=(X)=>z.get(X)?.keys,K=(X)=>z.get(X)?.state,H={get engine(){return W},actionKeys:j,actionState:K,bind:(X,...C)=>{if(!z.has(X))z.set(X,{keys:[],state:0});let B=z.get(X);for(let L of C){if(B.keys.some(($)=>D($,L)))continue;H.unbind(L),B.keys.push(L),_.set(L,X),Z.emit(new r({action:X,key:L}))}return z.set(X,B),H},clear:(...X)=>{for(let C of X){let B=z.get(C);if(B){let L=B.keys.slice();H.unbind(...L),Z.emit(new c({action:C,keys:L})),z.delete(C)}}return H},keyState:(X)=>K(_.get(X)),register:(X,C,...B)=>{if(!J.get(X))J.set(X,{decay:C.milliseconds,decaying:null,keys:B,progress:[]}),Z.emit(new zZ({sequence:X,keys:B}));return H},reset:()=>{return _.forEach((X)=>{H.clear(X)}),J.forEach((...[,X])=>{H.unregister(X)}),H},sequenceProgress:(X)=>{let C=J.get(X);return C?k(C.progress.length,C.keys.length):0},start:()=>{if(!G)G=!0,addEventListener(&quot;keydown&quot;,Q),addEventListener(&quot;keyup&quot;,Q);return H},stop:()=>{if(G)G=!1,removeEventListener(&quot;keydown&quot;,Q),removeEventListener(&quot;keyup&quot;,Q);return H},unbind:(...X)=>{for(let C of X){let B=_.get(C);if(!B)continue;Z.emit(new a({action:B,key:C})),_.delete(C);let L=z.get(B);L.keys=L.keys.filter(($)=>!D($,C))}return H},unregister:(...X)=>{for(let C of X){let B=J.get(C);if(!B)continue;Z.emit(new JZ({sequence:C,keys:B.keys})),J.delete(C)}return H}};return H};class c extends CustomEvent{constructor(Z){super(&quot;clear&quot;,{detail:Z})}}class i extends CustomEvent{constructor(Z){super(&quot;actionHeld&quot;,{detail:Z})}}class o extends CustomEvent{constructor(Z){super(&quot;actionPressed&quot;,{detail:Z})}}class n extends CustomEvent{constructor(Z){super(&quot;actionReleased&quot;,{detail:Z})}}class r extends CustomEvent{constructor(Z){super(&quot;bind&quot;,{detail:Z})}}class a extends CustomEvent{constructor(Z){super(&quot;unbind&quot;,{detail:Z})}}class t extends CustomEvent{constructor(Z){super(&quot;sequenceComplete&quot;,{detail:Z})}}class e extends CustomEvent{constructor(Z){super(&quot;sequenceDropped&quot;,{detail:Z})}}class ZZ extends CustomEvent{constructor(Z){super(&quot;sequenceProgress&quot;,{detail:Z})}}class zZ extends CustomEvent{constructor(Z){super(&quot;register&quot;,{detail:Z})}}class JZ extends CustomEvent{constructor(Z){super(&quot;unregister&quot;,{detail:Z})}}var WZ=({onFrame:Z,onSkip:W,onTick:z,tickRate:_})=>{let J=-1,G,Q=0,j=!1,K=_.milliseconds,Y=(N)=>{if(J=requestAnimationFrame(Y),!G||j){G=N;return}let U=N-G;if(U>1000)W(U),U=K;Q+=U;while(Q>=K)z(K),Q-=K;Z(Q),G=N};return{get paused(){return j},get running(){return J!==-1},pause(){return j=!j},start(){if(J===-1)return J=requestAnimationFrame(Y),!0;return!1},stop(){if(J!==-1)return cancelAnimationFrame(J),J=-1,!0;return!1}}};var xZ=(Z,W,z=300)=>{let _=Math.max(performance.now()-Z.milliseconds,0);return performance.getEntriesByName(W,&quot;mark&quot;).slice(-z).filter(({startTime:J})=>Math.sign(J-_)===1).length},y=(Z,W=300)=>xZ(u(1),Z,W);var _Z=(Z)=>{let W=S(250),z,_=()=>{if(performance.getEntries().length<25000)return;let N=performance.getEntriesByName(&quot;rendered&quot;,&quot;mark&quot;).slice(-150),U=performance.getEntriesByName(&quot;updated&quot;,&quot;mark&quot;).slice(-150);performance.clearMarks(&quot;rendered&quot;),performance.clearMarks(&quot;updated&quot;),N.concat(U).forEach(({name:A,startTime:O})=>performance.mark(A,{startTime:O}))},J=d().on(&quot;rendered&quot;,()=>{performance.mark(&quot;rendered&quot;)}).on(&quot;updated&quot;,()=>{performance.mark(&quot;updated&quot;)}).on(&quot;enginePaused&quot;,(N)=>{if(N.detail.state)clearInterval(z),z=0;else z=setInterval(_)}).on(&quot;engineStarted&quot;,()=>{if(z)return;z=setInterval(_)}).on(&quot;engineStopped&quot;,()=>{if(!z)return;clearInterval(z),z=0}),G=b(()=>y(&quot;rendered&quot;),W),Q=1000/Z.TPS,j=b(()=>y(&quot;updated&quot;),W),K=WZ({onFrame(N){Z.render(N/Q),J.emit(new GZ)},onSkip(N){J.emit(new NZ((N-1000)/Q))},onTick(N){Z.update(N),J.emit(new XZ)},tickRate:S(Q)}),Y={get FPS(){return G()},get paused(){return K.paused},get running(){return K.running},get TPS(){return j()},get keyboardHandler(){return M},emit(N){return J.emit(N),this},off(N,U){return J.off(N,U),this},on(N,U){return J.on(N,U),this},once(N,U){return J.once(N,U),this},pause(){return J.emit(new QZ({time:performance.now(),state:K.pause()})),this},set(N){return J.set(N),this},start(){if(K.start())J.emit(new VZ(performance.now()));return this},stop(){if(K.stop())J.emit(new HZ(performance.now()));return this}},M=s(J,Y);return Y};class QZ extends CustomEvent{constructor(Z){super(&quot;enginePaused&quot;,{detail:Z})}}class VZ extends CustomEvent{constructor(Z){super(&quot;engineStarted&quot;,{detail:Z})}}class HZ extends CustomEvent{constructor(Z){super(&quot;engineStopped&quot;,{detail:Z})}}class GZ extends CustomEvent{constructor(){super(&quot;rendered&quot;)}}class NZ extends CustomEvent{constructor(Z){super(&quot;skippedFrames&quot;,{detail:Z})}}class XZ extends CustomEvent{constructor(){super(&quot;updated&quot;)}}var p=(Z,W=0,z=1)=>Z<W?W:Z>z?z:Z;var DZ=(Z,W=Math.random()*v>>>0)=>{let z=Z(W).drop(12),_=()=>z.next().value/v,J=(Q,j=!1)=>typeof Q===&quot;undefined&quot;?z.next().value:_()*(Q+ +j|0)|0;return{randFloat:_,randInt:J,randRange:(Q,j,K=!1)=>J(j-Q|0,K)+Q|0}};function*RZ(){while(!0)yield Math.random()*v>>>0;throw new Error}var jZ=()=>DZ(()=>RZ());var v=4294967296;function UZ(Z,W,z=R()){if(typeof W===&quot;number&quot;)z[0]=Z[0]+W,z[1]=Z[1]+W;else z[0]=Z[0]+W[0],z[1]=Z[1]+W[1];return z}var m={x:{get(){return this[0]},set(Z){this[0]=Z},enumerable:!0},y:{get(){return this[1]},set(Z){this[1]=Z},enumerable:!0}};function R(...[Z,W]){if(typeof Z===&quot;undefined&quot;)return Object.defineProperties(new Float64Array(2),m);else if(Z===+Z&&W===+W)return Object.defineProperties(new Float64Array([Z,W]),m);else if(Z instanceof Float64Array)return Object.defineProperties(new Float64Array(Z),m);throw new Error(&quot;Invalid arguments passed to &apos;vector2&apos;&quot;)}Object.defineProperty(R,Symbol.hasInstance,{value:(Z)=>Z instanceof Float64Array&&Z.length===2&&Z.x===Z[0]&&Z.y===Z[1]});var KZ=(Z={})=>{let W,z=100,_=5000,J=-1,G,Q,j,K,Y,M,N,U=(V={})=>{for(let H in V)x[H](V[H]);return x},A=()=>{let V=!1;if(M)V||=w(M());if(W)V||=w(!W());return V},O=()=>{let V=!1;if(Y)V||=w(Y());if(N)V||=w(!N());return V},T=()=>{if(O())return;let V=null;if(G)V=G();if(V instanceof Promise)V.then(A);else A()},w=(V)=>{if(V)x.stop();return!!V},x={get running(){return J!==-1},because:(V,H)=>{return W=V,U(H)},begin:(V,H)=>{return j=V,U(H)},configure:(V)=>{return U(V)},do:(V,H)=>{return G=V,U(H)},end:(V,H)=>{return K=V,U(H)},every:(V,H)=>{return z=V.milliseconds,U(H)},for:(V,H)=>{return _=V.milliseconds,U(H)},start:()=>{if(J!==-1)return;if(j)j();return J=setInterval(T,z),Q=setTimeout(x.stop,_),T(),!0},stop:()=>{if(J===-1)return;if(clearInterval(J),clearTimeout(Q),J=-1,K)K();return!0},unless:(V,H)=>{return Y=V,U(H)},until:(V,H)=>{return M=V,U(H)},while:(V,H)=>{return N=V,U(H)}};return U(Z)};var LZ=()=>{if(!I.paused)I.pause()},EZ=()=>{if(I.paused)I.pause()},g=document.querySelector(&quot;#debugHUD&quot;),h=KZ({do:()=>{if(I.paused&&!g.innerText.includes(&quot;Paused&quot;))g.innerText+=&quot; | Paused&quot;}}),CZ,BZ,YZ=document.querySelector(&quot;#ball&quot;),F=jZ(),PZ=F.randRange(1,5,!0)*(F.randFloat()<0.5?1:-1),OZ=F.randRange(1,5,!0)*(F.randFloat()<0.5?1:-1),P=R(PZ,OZ),TZ=F.randRange(0,innerWidth-16,!0),$Z=F.randRange(0,innerHeight-16,!0),E=R(TZ,$Z),I=_Z({TPS:60,render:(Z)=>{g.innerText=`Engine TPS: ${BZ} | Engine FPS: ${CZ}`,YZ.style.left=`${E.x+Z*P.x}px`,YZ.style.top=`${E.y+Z*P.y}px`},update:()=>{if({FPS:CZ,TPS:BZ}=I,!h.running)h.start();if(UZ(E,P,E),E.x<0||E.x>=innerWidth-16)E.x=p(E.x,0,innerWidth-16),P.x*=-1;if(E.y<0||E.y>=innerHeight-16)E.y=p(E.y,0,innerHeight-16),P.y*=-1}});addEventListener(&quot;beforeunload&quot;,()=>{I.stop(),h.stop(),removeEventListener(&quot;blur&quot;,LZ),removeEventListener(&quot;focus&quot;,EZ)});addEventListener(&quot;blur&quot;,LZ);addEventListener(&quot;focus&quot;,EZ);if(document.readyState===&quot;complete&quot;)I.start();else addEventListener(&quot;load&quot;,()=>{I.start()});</script>"></iframe>
