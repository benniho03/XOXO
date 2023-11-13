export default function Page({ params }: { params: { game: string } }) {
  return <>
    <h1>Game: {params.game}</h1>
    <p>TODO: implement game</p>
  </>;
}
