import SvgIcon from './SvgIcon'

const Loading = () => {
  return (
    <div className="w-full h-full min-h-40 flex justify-center items-center text-text">
      <div className="animate-spin">
        <SvgIcon symbolId="Loading" width="25px" height="25px"></SvgIcon>
      </div>
    </div>
  )
}
export default Loading
