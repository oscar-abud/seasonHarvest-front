import useUserStore from '../store/store'

function test() {
  const userData = useUserStore((state) => state.userData);
  console.log(userData);

  return (
    <div>test</div>
  )
}

export default test