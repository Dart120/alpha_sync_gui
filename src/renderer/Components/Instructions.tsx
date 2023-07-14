const Instructions = () => {
  const message = 'Share photos via wifi on your camera (MENU -> Network -> Send To Smartphone Func -> Send To Smartphone -> Select on device), connect your computer to the wifi provided by the camera, press the Refresh/Reconnect option in the actions menu! Once connected you can select images then press the download option';
  return (
    <div>
      <p style={{ margin: '5em', overflow: 'hidden' }}>{message}</p>
    </div>
  );
};

export default Instructions;
