# sah
### Sass And Html WORKER

Need / Necesita

```
nvm > 6.0
```

Install / Instalacion

```
npm install
```

how it work / como funciona
```
npm run start
```

The files with -tocompile.html inside app/src will be compiled and delivered in app/output
<br />Los archivos con -tocompile.html que esten en app/src seran compialados y enviados a app/output

Example / Ejemplo:
<br/>app/src/index-tocompile.html
<br/>with code / con el codigo
```
<body>
  <!-- @import elements/hello.html -->
</body>
```
And / Y
<br/>app/src/elements/hello.html
<br/>with code / con el codigo
```
<div>
  <p>Hola mundo</p>
</div>
```

will generate / va a generar : app/output/index.html  
<br /> with / con
```
<body>
  <div>
    <p>Hola mundo</p>
  </div>
</body>
```


The files with *.scss inside app/src/sass will be compiled and delivered in app/output/assets/css
<br />Los archivos con *.scss que esten en app/src/sass seran compialados y enviados a app/output/assets/css

Example / Ejemplo:
<br/>app/src/sass/index.scss
<br/>with code / con el codigo
```
body {
  background-color: red;
  div {
    background-color: blue;
  }
}
```

will generate / va a generar : app/output/css/index.css  
<br /> with / con
```
body {
  background-color: red;  
}
body div {
  background-color: blue;
}
```

Include watch for modified files in developer / Inlcuido Watch para archivos modificados en desarrollo


Make a directory structure / Crea una estructura de carpetas

```
app/
app/output/
app/output/css
app/src/
app/src/sass/
```


###NOW WITH AUTOPREFIXER / Ahora con autoprefixer

In / en index.js

```
var AUTOPREFIXER = true; // or false, as you wish , como quieras
```
