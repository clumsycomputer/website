import type { NextPage } from "next";
import Link from "next/link";
import { Fragment, ReactNode } from "react";
import {
  ExternalNavigationFooter,
  InternalNavigationFooter,
} from "../../common/NavigationFooter/NavigationFooter";
import { Page } from "../../common/Page/Page";
import { HeaderSection } from "./common/HeaderSection";
import { JobSection } from "./common/JobSection";
import { SchoolSection } from "./common/SchoolSection";
import styles from "./ResumePage.module.scss";

export const ResumePage: NextPage = () => {
  return (
    <ResumePageBase
      navigationFooter={
        <InternalNavigationFooter
          routeLinks={[
            { routeName: "home", routeHref: "/" },
            { routeName: "graphics", routeHref: "/graphics" },
          ]}
          pdfLink={
            <Link href="/pdfs/resume.pdf">
              <a>view pdf</a>
            </Link>
          }
        />
      }
    />
  );
};

export const ResumePdfPage: NextPage = () => {
  return (
    <ResumePageBase
      navigationFooter={
        <ExternalNavigationFooter
          websiteLinks={[
            {
              linkLabel: "website",
              linkText: "jmath.dev",
              linkHref: "todo",
            },
            {
              linkLabel: "github",
              linkText: "clumsycomputer",
              linkHref: "https://github.com/clumsycomputer",
            },
            {
              linkLabel: "hnews",
              linkText: "jmath",
              linkHref: "https://news.ycombinator.com/user?id=jmath",
            },
          ]}
        />
      }
    />
  );
};

interface ResumePageBaseProps {
  navigationFooter: ReactNode;
}

function ResumePageBase(props: ResumePageBaseProps) {
  const { navigationFooter } = props;
  return (
    <Page
      accessibilityLabel={"resume"}
      pageTabTitle={"resume - clumsycomputer"}
      pageDescription={
        "a concise overview of jared mathews's career in software development"
      }
      pageContentContainerClassname={styles.pageContentContainer}
    >
      <HeaderSection
        fullName={"jared mathews"}
        emailAddress={"clumsycomputer@gmail.com"}
        briefText={
          "a balanced frontend developer who has worked on a variety of products across several companies"
        }
        statusText={
          <Fragment>
            focused on sharing, documenting, and developing{" "}
            <a href="https://github.com/clumsycomputer/graphics-renderer#readme">
              <b>graphics-renderer</b>
            </a>
            , an open-source tool for rapidly developing animations where frames
            are described with svg à la react
          </Fragment>
        }
      />
      <JobSection
        companyName={"wyyerd intuition"}
        teamName={"engineering"}
        jobTitle={"frontend developer"}
        dateRange={"2022.06 - 2022.02"}
        productDescription={
          "a web app aimed at internet service providers that assists employees in scheduling and completing a variety of tasks ranging from managing network infrastructure to analyzing client subscriptions"
        }
        workResponsibilities={[
          "provide thorough and detailed code reviews with an emphasis on iteration",
          "refactor a number of entrenched components in order to enable a requested feature or fix an outstanding bug while minimizing breaking changes to existing apis",
          "adapt and bend third-party component libraries to support undocumented use-cases",
          "participate in establishing best practices for frontend development with a focus on component composition that is fairly formulaic in implementation and resulted in code that was more straightforward to reason about",
          "participate in sprint planning and issue prioritization",
          "collaborate with teammates on problems where unobivous or unique solutions were required",
        ]}
        techStack={[
          "vue@2",
          "apollo",
          "bootstrap",
          "playwright",
          "typescript",
          "scss",
          "graphql",
          "git",
        ]}
      />
      <JobSection
        companyName={"native roots"}
        teamName={"operations"}
        jobTitle={"frontend developer"}
        dateRange={"2021.04 - 2020.12"}
        productDescription={
          "two unique web stores each serving their own market of cannabis consumers either in colorado, united states or manitoba, canada"
        }
        workResponsibilities={[
          "provide clients with a simpler less error-prone purchase flow",
          "revive an abandoned and brittle nextjs codebase",
          "stabilize repository via typescript, more comprehensive e2e test, simpler environment/dependency management, and a modernized palette of development scripts for a streamlined workflow",
          "migrate from shopify api to dutchie plus api for a smoother cannabis shopping experience",
          "resolve outstanding wcag 2.1 level aa and ada title iii accessibility lawsuit",
        ]}
        techStack={[
          "nextjs",
          "react",
          "typescript",
          "graphql",
          "nodejs",
          "cypress",
          "firebase",
          "git",
        ]}
      />
      <JobSection
        companyName={"confident cannabis"}
        teamName={"wholesale"}
        jobTitle={"junior developer"}
        dateRange={"2020.04 - 2019.05"}
        productDescription={
          "a b2b marketplace/network that helps licensed businesses in the cannabis industry manage and transact tested inventory"
        }
        workResponsibilities={[
          "empower clients by simplifying their operations in a tightly regulated industry",
          "improve experience around order creation/management",
          "collaborate with teammates on monthly milestones",
          "identify, describe, and patch bugs",
          "maintain, design, and implement react forms/inputs",
          "maintain, design, and implement react hooks",
          "maintain and refactor legacy react components",
        ]}
        techStack={[
          "react",
          "typescript",
          "material-ui",
          "redux",
          "storybook",
          "git",
        ]}
      />
      <JobSection
        companyName={"datasplice"}
        teamName={"research & development"}
        jobTitle={"apprentice developer"}
        dateRange={"2018.05 - 2016.05"}
        productDescription={
          "an offline-first/mobile-first web app that helps enterprise organize, navigate, and manipulate data regardless of location"
        }
        workResponsibilities={[
          "collaborate with teammates towards providing clients with a flexible and reliable platform for assisting workers out in the field",
          "identify, describe, and patch bugs",
          "maintain and integrate bluetooth hardware for cordova ios extension",
          "design and implement a robust component for marking-up/annotating images on the fly",
          "maintain, design, and implement a shared react components library",
          "begin refactor of core app functionality towards improved readability/testability by way of redux-saga",
        ]}
        techStack={[
          "react",
          "redux",
          "redux-saga",
          "cordova",
          "coffeescript",
          "git",
        ]}
      />
      <SchoolSection
        schoolName={"galvanize"}
        programName={"fullstack web development"}
        dateRange={"2016.04 - 2015.10"}
        programDescription={
          "an immersive six-month bootcamp that covered technologies, patterns, and best-practices applied throughout industry"
        }
        techStack={[
          "javascript",
          "nodejs",
          "git",
          "css",
          "express",
          "postgresql",
        ]}
      />
      {navigationFooter}
    </Page>
  );
}