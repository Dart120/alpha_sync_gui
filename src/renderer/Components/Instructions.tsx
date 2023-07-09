const Instructions = () => {
  const message = 'Share photos via wifi on your camera (MENU -> Network -> Send To Smartphone Func -> Send To Smartphone -> Select on device), connect your computer to the wifi provided by the camera, press the Refresh/Reconnect button! Once connected you can select images then press the download button';
  return (
    <div>
      <p style={{ margin: '5em', overflow: 'hidden' }}>{message}</p>
    </div>
  );
};

export default Instructions;
