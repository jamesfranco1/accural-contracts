declare module "vanta/dist/vanta.topology.min" {
  const topology: (options: Record<string, unknown>) => {
    destroy?: () => void;
    resize?: () => void;
  };

  export default topology;
}
