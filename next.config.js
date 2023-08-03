/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		CLOUD_NAME: "dlyoovaha",
		CLOUDINARY_API_KEY: "621888197357198",
		CLOUDINARY_API_SECRET: "ovs_RVZL5aDPiRlDvCYZgXyHaSA",
	  },
	
	  images: {
		domains: ["res.cloudinary.com", "lh3.googleusercontent.com"],
	  },
}

module.exports = nextConfig
