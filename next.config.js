import withTM from 'next-transpile-modules';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

export default withTM(['react-dom'])(nextConfig);
