const nextConfig = {
  // reactCompiler: true, // Disabled - requires babel-plugin-react-compiler

  cacheComponents: false, // Disabled to fix dynamic route build issues

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
