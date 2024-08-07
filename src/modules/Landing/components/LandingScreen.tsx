"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import ShinyButton from "~/components/ui/shinny-button";
import FooterContent from "./footer-content";

const TeamCard = ({ username, role, description, img, url }) => {
  return (
    <Link href={url}>
      <div className="flex flex-col justify-center rounded-xl bg-[#111021] px-1 pb-12 pt-8 hover:bg-accent">
        <img
          src={img}
          className="mx-auto -mt-24  mb-4 h-32 w-32 rounded-full"
        />
        <div className="flex w-full flex-col gap-2 text-center">
          <span className="md:text-lg">{username}</span>
          <span>{role}</span>
          <span className="text-gray-600">{description}</span>
        </div>
      </div>
    </Link>
  );
};
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
              <div className="flex items-center space-x-1">
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
              </div>
            </div>
            <div className="items-center space-x-1 md:flex">
              <Link href="/app">
                <ShinyButton>
                  <Button className="bg-gradient-to-r from-[#B458FB] to-[#2CDEB9] text-white">
                    Launch App
                  </Button>
                </ShinyButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div
        className="absolute inset-0 h-[148vh] bg-right-top bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-landing-bg.png')",
        }}
      ></div>
      <section className="relative flex min-h-screen items-center justify-between">
        <div
          className="absolute inset-0 bg-left-top bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/images/DegradadoSeccion1Izquierdo.png')",
          }}
        ></div>

        <div className="container z-20 mx-auto flex flex-col items-center justify-between gap-12 px-4 py-48 sm:px-6 sm:py-32 md:py-24 lg:flex-row lg:px-40 lg:py-0">
          <div className="text-center lg:w-3/5 lg:text-left">
            <p className="gradient-text mb-2 text-sm font-medium uppercase tracking-widest">
              A Decentralized File Sharing Platform
            </p>
            <h1 className="mb-4 text-5xl font-extrabold leading-none md:text-4xl">
              <span>Share Your Files In A</span>
              <br />
              <span className="gradient-text">
                Decentralized & Intuitive
              </span>{" "}
              <br />
              <span>Manner</span>
            </h1>
            <p className="mb-8 text-lg font-light leading-relaxed text-gray-300 md:text-xl">
              We provide a collaborative, decentralized and easy-to-use file
              storage interface for any user. Powered by Solana.
            </p>
            <a
              href="/transfer"
              className="inline-block rounded-full bg-white px-8 py-3 font-bold uppercase tracking-widest text-black transition duration-200 hover:bg-gray-600"
            >
              Send your first file!
            </a>
          </div>
          <div className="md:w-5/5 flex w-4/5 sm:h-[400px] lg:block lg:w-2/5">
            <img
              src="/hero-landing-accompanion.png"
              alt="SolDrive on devices"
              className="ml-auto lg:flex-row"
            />
          </div>
        </div>
      </section>

      <section className="bg-transparent px-4">
        <div className="flex flex-col items-center justify-center bg-transparent pb-16 text-center">
          <img
            src="/assets/images/logo-sol.png"
            alt="Solana Logo"
            className="mx-auto mb-8 block w-52 max-w-full md:w-72"
          />
          <h1 className="gradient-text mb-4 text-4xl font-extrabold lg:w-3/5">
            Take control of the cloud, is your blockchain a secure vault
            storage?
          </h1>
          <p className="text-2xl text-white">Your keys, your files.</p>
        </div>
      </section>
      <div className="relative h-auto w-full">
        <div
          className="absolute inset-0 min-h-[208vh] max-w-full bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/images/DegradadosSeccion3.png')",
          }}
        ></div>
        <section className="relative overflow-x-hidden bg-transparent py-20 text-white">
          <div className="container relative z-10 mx-auto flex flex-col items-center justify-between px-4 lg:flex-row lg:px-48">
            <div className="text-center lg:w-2/5 lg:text-left">
              <h2 className="gradient-text mb-6 text-3xl font-bold">
                The Next Generation Of Cloud Storage
              </h2>
              <p className="mb-4">
                SolDrive combines the power of Solana blockchain and IPFS to
                offer secure storage with easy file sharing between wallets.
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
            <div className="flex justify-center lg:w-2/5 lg:justify-end">
              <img
                src="/assets/images/landing-assets/iconsosd.png"
                alt="Feature Icons"
                className="w-auto"
              />
            </div>
          </div>
        </section>

        <section className="relative flex items-center overflow-hidden py-20 text-white">
          {/* <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/images/DegradadosSeccion4.png')",
            }}
          ></div> */}

          <div className="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row lg:px-20">
            <div className="z-10 mb-8 flex justify-center md:mb-0 md:w-1/2 md:justify-start">
              <img
                src="/assets/images/landing-assets/SolDrivesdsadadas.png"
                alt="SolDrive App on Phone"
                className="z-10 w-4/5 rounded-lg md:w-3/5 lg:w-4/5"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="gradient-text mb-4 text-3xl font-bold lg:text-4xl">
                Why SolDrive?
              </h2>
              <p className="mb-4">
                We provide a tool to manage your assets and files in a secure &
                decentralized way. With the custody of your documents &
                interactions with your wallet you will be able to organize,
                share & work in group.
              </p>
              <p>
                We offer a wide variety of functionalities to share & add value
                to each file you have in custody.
              </p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-20 text-white">
          <div
            className="absolute left-0 top-0 h-full w-full bg-cover bg-no-repeat"
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
              <h2 className="gradient-text mb-6 text-5xl font-extrabold">
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
                process creates a file in IPFS that contains the content
                encrypted through the signature & then is presented on our
                platform to be edited, shared or elaborated with other users.
              </p>
              <a
                href="#"
                className="inline-block cursor-pointer rounded-full border-2 border-white bg-white px-8 py-3 font-bold uppercase tracking-widest text-black transition duration-300 hover:bg-gray-500 hover:text-black"
              >
                Learn More
              </a>
            </div>
            <div className="mx-auto flex flex-col items-center justify-between px-4 lg:w-2/5 lg:justify-end ">
              <img
                src="/assets/images/landing-assets/howitworks.png"
                alt="How It Works"
                className="w-auto"
              />
            </div>
          </div>
        </section>
        <section className="relative mt-4 flex w-full justify-center px-4 md:mt-12">
          <Link href="/waitlist">
            <img
              src="/CallToAction.png"
              className="w-full max-w-[1100px] cursor-pointer"
            />
          </Link>
        </section>
        <section className="relative flex w-full flex-col justify-center px-8 py-24 md:py-32">
          <div className="mx-auto flex w-full max-w-[1250px] flex-col justify-center">
            <h2 className="gradient-text mb-20 text-center text-3xl font-bold lg:text-4xl">
              The Team
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 gap-y-36 lg:grid-cols-4">
              <TeamCard
                username="@wildmark"
                role="Maker"
                description="Olyvia Labs Founder"
                img="/persons/mark.png"
                url=""
              />
              <TeamCard
                username="@0xpasho"
                role="Developer"
                description="Olyvia Labs Founder"
                img="/persons/pasho.png"
                url=""
              />
              <TeamCard
                username="@martelaxe"
                role="Developer"
                description="Shadowy Super Hacker"
                img="/persons/martelaxe.png"
                url=""
              />
              <TeamCard
                username="@EmmanuelSayre"
                role="Artist"
                description="DakStudio Founder"
                img="/persons/sayre.png"
                url=""
              />
            </div>
          </div>
        </section>
        <section className="relative flex w-full flex-col px-8 py-24 md:py-32">
          <h2 className="gradient-text mb-4 text-center text-3xl font-bold lg:text-4xl">
            It's time to own all your files in the cloud in a safe and fun way
          </h2>
          <div className="mt-4 flex justify-center">
            <a
              href="/transfer"
              className="inline-block rounded-full bg-white px-8 py-3 font-bold uppercase tracking-widest text-black transition duration-200 hover:bg-gray-600"
            >
              Send your first file!
            </a>
          </div>
        </section>
      </div>
      <footer className="bg-black py-6 text-white">
        <FooterContent />
      </footer>
    </>
  );
};
