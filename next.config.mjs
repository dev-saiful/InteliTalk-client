const nextConfig = {
  // reactCompiler: true, // Disabled - requires babel-plugin-react-compiler

  cacheComponents: true,

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
