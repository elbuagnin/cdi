let CDIOptions = { name: "", nlpData: false };

function setCDIOptions() {
  const optionList = arguments[0][0];

  if (typeof optionList === "string") {
    let args = optionList.split(" ");
    args = args.map((arg) => {
      return arg.trim();
    });

    const options = Object.values(args).map((arg) => {
      if (arg.includes("=")) {
        return arg.substring(0, arg.indexOf("="));
      } else {
        return arg;
      }
    });

    const settings = Object.values(args).map((arg) => {
      if (arg.includes("=")) {
        return arg.substring(arg.indexOf("=") + 1);
      } else {
        return true;
      }
    });

    options.forEach((option, key) => {
      const setting = settings[key];
      switch (option) {
        case "name":
          const regex = /^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/gm //ToDo: add unicode special characters
          if (setting.match(regex)) {
            CDIOptions.name = setting;
          }
          break;
        case "nlpData":
          if (setting === true || setting === false) {
            CDIOptions.nlpData = setting;
          }
          break;
        default:
          break;
      }
    });
  } else {
    return false;
  }
}

export {CDIOptions, setCDIOptions};
