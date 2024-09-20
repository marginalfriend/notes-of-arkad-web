import GetStartedButton from "./_components/get-started-button";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="w-[94vw] h-[97vh] md:w-[97vw] md:h-[94vh] flex flex-col items-center justify-center gap-8 bg-[url('/images/hero.jpg')] bg-cover bg-blend-lighten rounded-3xl">
        <div className="flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-[300px] w-[300px] md:h-[700px] md:w-[700px] rounded-full bg-gradient-to-r from-white to-transparent blur-3xl opacity-70"></div>
          </div>
          <h1 className="relative z-10 text-6xl md:text-9xl font-black">
            Arkad
          </h1>
          <h1 className="relative z-10 text-lg text-center md:text-2xl">
            Personal finance tracker made simple
          </h1>
        </div>
        <GetStartedButton />
      </div>
    </main>
  );
}
