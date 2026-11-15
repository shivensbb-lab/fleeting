// font files imported from the @fontsource packages are URLs
declare module "*.woff2" {
  const url: string;
  export default url;
}
