import GetStartedButton from "./_components/get-started-button";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-14 w-[97vw] h-[94vh] bg-[url('/images/hero.jpg')] bg-cover bg-blend-lighten rounded-3xl">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-9xl font-black">Arkad</h1>
          <h1 className="text-2xl">Personal finance tracker made simple</h1>
        </div>
        <GetStartedButton />
      </div>
    </main>
  );
}
