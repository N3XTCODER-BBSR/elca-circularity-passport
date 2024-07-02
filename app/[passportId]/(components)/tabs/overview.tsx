const Overview = ({ passportUuid }: { passportUuid: string }) => {
  return (
    <>
      <h2 className="mb-4 max-w-xl text-l font-extrabold leading-none tracking-tight dark:text-white md:text-2xl xl:text-xl">Gebäuderessourcenpass</h2>
      <p>Bundesministerium für ökologische Innovation, Biodiversitätsschutz und nachhaltigen Konsum – Dienstsitz Berlin</p>
      <span>Passport &quot;{passportUuid}&quot;</span>
    </>
  );
};

export default Overview;