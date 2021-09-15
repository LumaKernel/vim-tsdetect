import type { OptionDeclaration } from './readme';

export type ContributesConfigurationsConfiguration = {
  type: string;
  default: unknown;
  markdownDescription?: string;
};

export type ContributesConfigurations = {
  type: string;
  title: string;
  properties: {
    [optionName: string]: ContributesConfigurationsConfiguration;
  };
};

export type PackageJsonContributesConfigurations = {
  contributes: {
    configuration: ContributesConfigurations;
  };
};

export const applyOptionDeclarations = (
  json: Readonly<PackageJsonContributesConfigurations>,
  optionDeclarations: OptionDeclaration[],
): PackageJsonContributesConfigurations => {
  const properties = { ...json.contributes.configuration.properties };
  optionDeclarations.forEach((declaration) => {
    const property = properties[declaration.optionName];
    if (!property) {
      throw new Error(`Option ${declaration.optionName} in README does not exist in package.json.`);
    }
    properties[declaration.optionName] = {
      ...property,
      markdownDescription: declaration.descriptionLines.join('\n'),
    };
  });

  return {
    ...json,
    contributes: {
      ...json.contributes,
      configuration: {
        ...json.contributes.configuration,
        properties,
      },
    },
  };
};
