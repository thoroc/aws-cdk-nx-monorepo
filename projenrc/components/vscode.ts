import path from "path";
import { Component, JsonFile, Project } from "projen";

// Custom projen component that generates vscode settings
// and defines workspace directories for eslint. This allows
// the IDE to use the correct eslint config for the subproject.

const peacockColor = {
  "workbench.colorCustomizations": {
    "activityBar.activeBackground": "#ffad33",
    "activityBar.background": "#ffad33",
    "activityBar.foreground": "#15202b",
    "activityBar.inactiveForeground": "#15202b99",
    "activityBarBadge.background": "#00804c",
    "activityBarBadge.foreground": "#e7e7e7",
    "commandCenter.border": "#15202b99",
    "sash.hoverBorder": "#ffad33",
    "statusBar.background": "#ff9900",
    "statusBar.foreground": "#15202b",
    "statusBarItem.hoverBackground": "#cc7a00",
    "statusBarItem.remoteBackground": "#ff9900",
    "statusBarItem.remoteForeground": "#15202b",
    "titleBar.activeBackground": "#ff9900",
    "titleBar.activeForeground": "#15202b",
    "titleBar.inactiveBackground": "#ff990099",
    "titleBar.inactiveForeground": "#15202b99",
  },
  "peacock.remoteColor": "#ff9900",
};

export class VscodeSettings extends Component {
  constructor(rootProject: Project) {
    super(rootProject);

    new JsonFile(rootProject, ".vscode/settings.json", {
      obj: {
        "eslint.workingDirectories": rootProject.subprojects.map((project) => ({
          pattern: path.relative(rootProject.outdir, project.outdir),
        })),
        ...peacockColor,
      },
    });

    new JsonFile(rootProject, ".vscode/extensions.json", {
      obj: {
        recommendations: [
          "nrwl.angular-console",
          "esbenp.prettier-vscode",
          "dbaeumer.vscode-eslint",
          "amazonwebservices.aws-toolkit-vscode",
          "johnpapa.vscode-peacock",
        ],
      },
    });
  }
}
