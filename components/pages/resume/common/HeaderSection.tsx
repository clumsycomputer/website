import { Fragment, ReactNode } from "react";
import { DocumentSectionBase } from "../../../common/Document/DocumentSectionBase";
import { SectionContent } from "../../../common/Document/SectionContent";

export interface HeaderSectionProps {
  fullName: string;
  emailAddress: string;
  briefText: string;
  statusText: ReactNode;
}

export function HeaderSection(props: HeaderSectionProps) {
  const { fullName, emailAddress, briefText, statusText } = props;
  return (
    <DocumentSectionBase
      sectionDivider={null}
      accessibilityLabel={`career overview: ${fullName}`}
      headerLabels={[
        {
          variant: "text",
          label: fullName,
        },
        {
          variant: "link",
          label: emailAddress,
          linkHref: `mailto:${emailAddress}`,
        },
      ]}
      bodyContent={
        <Fragment>
          <SectionContent
            accessibilityLabel={`career brief: ${fullName}`}
            contentType={"text"}
            contentLabel={"brief"}
            textContent={briefText}
          />
          <SectionContent
            accessibilityLabel={`career status: ${fullName}`}
            contentType={"text"}
            contentLabel={"status"}
            textContent={statusText}
          />
        </Fragment>
      }
    />
  );
}
