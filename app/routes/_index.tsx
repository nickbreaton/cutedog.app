export function loader() {
  throw new Response(null, {
    status: 307,
    headers: { Location: '/lucy' }
  })
}
