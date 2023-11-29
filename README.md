# opencascade-three-typescript
Webpack configured for opencascade with three.js and typescript

# Features
- Typescript 💪
- Webpack configured to load opencascade wasm package
- Singleton design pattern

# To run the project
Execute the following commands in the root of the project after cloning this repository
```
npm install
```

```
npm run dev
```

# Fixing Errors with type definitions
Some of the typescript definitions are not configures in opencascade.js

To fix this, modify the file `node_modules>opencascade.js > dist > opencascade.full.d.ts`

Go to ***line no. 118184*** or near

Find the following lines:
```ts
export declare class TopExp_Explorer {
  Init(S: TopoDS_Shape, ToFind:TopAbs_ShapeEnum, ToAvoid: TopAbs_ShapeEnum): void;
----
----
```
Replace it as show below:
```ts
export declare class TopExp_Explorer {
  Init(S: TopoDS_Shape, ToFind: {}, ToAvoid: {}): void;
----
----
```
