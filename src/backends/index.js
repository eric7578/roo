export default async function getBackend() {
  const imports = {
    'github.com': () => import('./Github')
  };
  return imports[window.location.hostname]();
}
