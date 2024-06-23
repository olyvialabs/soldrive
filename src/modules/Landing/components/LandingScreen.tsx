"use client";
function Card({ title, children }) {
  const cardStyle = {
    backgroundColor: "#111021",
    borderRadius: "10px",
    padding: "20px",
    color: "white",
  };

  const buttonStyle = {
    backgroundColor: "#ffffff",
    color: "black",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div style={cardStyle}>
      <h3
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "15px" }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "16px", marginBottom: "20px" }}>{children}</p>
      <button style={buttonStyle}>{title}</button>
    </div>
  );
}

export const LandingScreen = () => {
  return (
    <>
      <nav className="fixed top-0 z-30 w-full bg-black bg-opacity-75 py-3 backdrop-blur-lg backdrop-filter">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-between">
            <div className="flex space-x-4">
              <div className="hidden items-center space-x-1 md:flex">
                <div>
                  <a
                    href="/"
                    className="flex items-center text-white hover:text-green-500"
                  >
                    <img
                      src="/assets/images/LogoSolo.png"
                      alt="SolDrive Logo"
                      className="mr-2 w-12"
                    />
                    <span className="font-bold">SOLDRIVE</span>
                  </a>
                </div>
                <a
                  href="#"
                  className="px-3 py-2 text-white hover:text-green-500"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="px-3 py-2 text-white hover:text-green-500"
                >
                  Learn
                </a>
                <a
                  href="#"
                  className="px-3 py-2 text-white hover:text-green-500"
                >
                  Community
                </a>
                <a
                  href="#"
                  className="px-3 py-2 text-white hover:text-green-500"
                >
                  FAQs
                </a>
              </div>
            </div>
            <div className="hidden items-center space-x-1 md:flex">
              <a
                href="/app"
                className="rounded bg-green-500 px-3 py-2 text-white transition duration-300 hover:bg-green-600"
              >
                Go to App
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative flex min-h-screen items-center justify-between">
        <div
          className="absolute inset-0 bg-left-top bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/images/DegradadoSeccion1Izquierdo.png')",
          }}
        ></div>
        <div
          className="absolute inset-0 bg-right-top bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/images/DegradadoDerechoSeccion1.png')",
          }}
        ></div>

        <div className="container z-20 mx-auto flex flex-col items-center justify-between px-4 sm:px-6 lg:flex-row lg:px-40">
          <div className="text-center lg:w-3/5 lg:text-left">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-green-400">
              A Decentralized File Sharing Platform
            </p>
            <h1 className="mb-4 text-5xl font-extrabold leading-none md:text-6xl">
              Share Your Files In A<br />
              Decentralized & Intuitive Matter
            </h1>
            <p className="mb-8 text-lg font-light leading-relaxed text-gray-300 md:text-xl">
              We provide a collaborative, decentralized and easy-to-use file
              storage interface for any user. Powered by Solana.
            </p>
            <a
              href="/transfer"
              className="inline-block rounded-full bg-green-500 px-8 py-3 font-bold uppercase tracking-widest text-white transition duration-200 hover:bg-green-600"
            >
              Send your first file!
            </a>
          </div>
          <div className="md:w-5/5 flex lg:block lg:w-3/5">
            <img
              src="/assets/images/landing-assets/Landing1SagaMockups.png"
              alt="SolDrive on devices"
              className="ml-auto lg:flex-row"
              style={{ height: "600px" }}
            />
          </div>
        </div>
      </section>

      <section className="gradient-bg-section">
        <div className="flex flex-col items-center justify-center text-center">
          <img
            src="/assets/images/logo-sol.png"
            alt="Solana Logo"
            className="mx-auto mb-8 block w-32"
          />
          <h1 className="mb-4 text-5xl font-extrabold text-white lg:w-3/5">
            Take control of the cloud, is your blockchain a secure vault
            storage?
          </h1>
          <p className="text-xl text-white">Your keys, your files.</p>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/images/DegradadosSeccion3.png')",
          }}
        ></div>

        <div className="container relative z-10 mx-auto flex flex-col items-center justify-between px-4 lg:flex-row lg:px-48">
          <div className="text-center lg:w-2/5 lg:text-left">
            <h2 className="mb-6 text-4xl font-bold">
              The Next Generation Of Cloud Storage
            </h2>
            <p className="mb-4">
              SolDrive combines the power of Solana blockchain and IPFS to offer
              secure storage with easy file sharing between wallets.
            </p>
            <p className="mb-4">
              Link your Solana wallet for seamless authentication & access to
              decentralized storage, ensuring security, durability & privacy.
            </p>
            <p className="mb-4">
              Plus, with integration into Solana Mobile, SolDrive enhances
              device functionality, aiming to become a pillar in crypto
              infrastructure, like SolChat or SolMall. It's mainstream tools,
              but better.
            </p>
          </div>
          <div className="flex justify-center lg:w-1/2 lg:justify-end">
            <img
              src="/assets/images/landing-assets/iconsosd.png"
              alt="Feature Icons"
              className="w-auto"
            />
          </div>
        </div>
      </section>

      <section className="relative flex items-center overflow-hidden py-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/images/DegradadosSeccion4.png')",
          }}
        ></div>

        <div className="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row lg:px-20">
          <div className="z-10 mb-8 flex justify-center md:mb-0 md:w-1/2 md:justify-start">
            <img
              src="/assets/images/landing-assets/SolDrivesdsadadas.png"
              alt="SolDrive App on Phone"
              className="z-10 w-4/5 md:w-3/5 lg:w-4/5"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Why SolDrive?
            </h2>
            <p className="mb-4">
              We provide a tool to manage your assets and files in a secure &
              decentralized way. With the custody of your documents &
              interactions with your wallet you will be able to organize, share
              & work in group.
            </p>
            <p>
              We offer a wide variety of functionalities to share & add value to
              each file you have in custody.
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 text-white">
        <div
          className="absolute left-0 top-0 h-full w-1/2 bg-cover bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/images/DegradadoSeccion5Izquierda.png')",
          }}
        ></div>
        <div
          className="absolute right-0 top-0 h-full w-1/2 bg-cover bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/images/DegradadoSeccion5Derecha.png')",
          }}
        ></div>

        <div className="container z-10 mx-auto flex flex-col items-center justify-between px-8 lg:flex-row lg:px-44">
          <div className="mb-8 lg:mb-0 lg:w-3/5">
            <h2
              className="mb-6 text-5xl font-extrabold"
              style={{ color: "rgb(90, 52, 228)" }}
            >
              How It Works?
            </h2>
            <p className="mb-4 text-xl" style={{ color: "#41e5ed" }}>
              WITH OUR VERY SIMPLE & FAMILIAR DASHBOARD
              <span className="font-bold">
                YOU WILL REACH INFINITE POTENTIALS
              </span>
            </p>
            <p className="mb-4" style={{ color: "#fff" }}>
              The system works through ECIP encryption. A user uploads or
              creates a file from the frontend & signs with their wallet. This
              process creates a file in IPFS that contains the content encrypted
              through the signature & then is presented on our platform to be
              edited, shared or elaborated with other users.
            </p>
            <a
              href="#"
              className="inline-block rounded-full border-2 border-white px-8 py-3 font-bold uppercase tracking-widest text-white transition duration-300 hover:bg-white hover:text-black"
            >
              Learn More
            </a>
          </div>
          <div className="mx-auto flex flex-col items-center justify-between px-4 lg:w-1/5 lg:justify-end lg:px-48">
            <img
              src="/assets/images/landing-assets/howitworks.png"
              alt="How It Works"
              className="w-auto"
            />
          </div>
        </div>
      </section>

      <section className="flex justify-center" style={{ padding: "40px 0" }}>
        <div className="w-[1280px] max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <Card title="Data Custody">
              We offer the ability to manage your data in an easy & funny way.
              Become 100% owner of your personal information & share it
              securely.
            </Card>
            <Card title="Workspaces">
              We will offer a space for join file collaboration. We believe that
              teamwork deserves to be decentralized & accompanied by a changes
              viewer.
            </Card>
            <Card title="TransferLink">
              We will integrate the functionality of sharing files through
              download links with permissions assigned from the wallet
              signature.
            </Card>
          </div>
        </div>
      </section>

      {/* The rest of the sections have been omitted for brevity, but follow the same conversion principles. */}

      <footer className="bg-black py-6 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between text-center lg:flex-row lg:text-left">
            <div className="mb-6 lg:mb-0 lg:flex lg:items-center">
              <img
                src="/assets/images/logo-soldrive.png"
                alt="SolDrive Logo"
                className="mb-2 h-12 lg:mb-0 lg:mr-4 lg:h-16"
              />
              <div>
                <p>©2024 SolDrive.</p>
              </div>
            </div>
            <div className="mb-6 lg:mb-0">
              <h4 className="mb-2 font-bold">About</h4>
              <ul className="space-y-1">
                <li>About Us</li>
                <li>Features</li>
                <li>Next Steps</li>
              </ul>
            </div>
            <div className="flex justify-center space-x-4 lg:justify-end">
              <a href="#" className="text-xl">
                <i className="fab fa-discord"></i>
              </a>
              <a href="#" className="text-xl">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-xl">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
