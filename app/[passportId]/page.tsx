export default function Page({ params }: { params: { passportId: string } }) {
    return <div>Passport &quot;{params.passportId}&quot;</div>
}
  