# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 배포

AWS EC2 배포는 백엔드와 같은 nginx 뒤에서 함께 서빙한다. 전체 절차는 백엔드 저장소의
`docs/deploy/aws-architecture.md` 를 따른다. 이 저장소에서는 이미지만 만들어 올린다.

```bash
docker build -t $DOCKERHUB_USER/cen-edu-frontend:1.0.0 \
  --build-arg VITE_MYSCRIPT_APPLICATION_KEY=... \
  --build-arg VITE_MYSCRIPT_HMAC_KEY=... .
docker push $DOCKERHUB_USER/cen-edu-frontend:1.0.0
```

`VITE_` 값은 빌드 시점에 번들에 박힌다. 값을 바꾸려면 이미지를 다시 빌드해 새 태그로 올린다.
