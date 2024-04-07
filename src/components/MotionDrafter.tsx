"use client";

import { useState } from "react";
import Stepper from "./Stepper";
import Spinner from "./Spinner";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import * as Accordion from "@radix-ui/react-accordion";
import { FaCaretDown } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { useCopyToClipboard } from "usehooks-ts";
type ViewType = "data" | "review" | "export";

const MotionDrafter = ({ type = "respond" }: any) => {
  const [discoveryRequests, setDiscoverRequests] = useState<string>();
  const [view, setView] = useState<ViewType>("data");
  const [formError, setFormError] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingExport, setLoadingExport] = useState(false);

  const handleChangeRequests = (e: any) => {
    setFormError(false);
    setDiscoverRequests(e.target.value);
  };

  const handleSubmitRequests = async () => {
    const hasError = !discoveryRequests;
    setFormError(hasError);

    if (hasError) return;

    setView("review");
    try {
      setLoadingReview(true);
      const res = await fetch("/api/analyze", { method: "POST" });
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReview(false);
    }
  };

  const [draft, setDraft] = useState("");
  const handleSubmitGenerate = async () => {
    setView("export");
    try {
      setLoadingExport(true);
      const res = await fetch("/api/generate", { method: "POST" });
      const data = await res.json();
      setDraft(data.motion);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExport(false);
    }
  };

  const renderDiscoveryRequestForm = () => {
    return (
      <>
        <h1 className="text-3xl">Discovery Requests</h1>
        <p className="my-4 text-sm text-gray-500">
          {type === "respond"
            ? `To help you file a motion, please copy and paste discovery requests that you've received from the opposing party.`
            : `To help you file a motion, please copy and paste discovery requests that you've received from the opposing party.`}
        </p>
        <div className="my-8">
          <textarea
            className="w-full h-[500px] border border-gray-200 p-3 rounded"
            placeholder="Paste discovery requests here"
            onChange={handleChangeRequests}
            value={discoveryRequests}
            autoFocus
          />
          {formError && (
            <p className="text-red-500 text-sm">
              Discovery requests are required
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col justify-end items-end">
            <button
              className="btn-blue"
              onClick={handleSubmitRequests}
              disabled={!discoveryRequests}
            >
              Submit for review
            </button>
            <p className="text-xs text-gray-400 my-3">
              By submitting, our LLM model will review & flag all violations
            </p>
          </div>
        </div>
      </>
    );
  };

  const renderViolations = () => {
    if (loadingReview) {
      return (
        <>
          <h1 className="text-3xl">Review Violations</h1>
          <div className="h-[500px] flex justify-center items-center">
            <div className="flex gap-0.25 items-center">
              <Spinner />
              <div className="text-sm text-gray-500">
                Reviewing discovery requests...
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">Review Violations</h1>
          <button className="btn-blue" onClick={handleSubmitGenerate}>
            Generate
          </button>
        </div>
        <p className="my-4 text-sm text-gray-500">
          {type === "respond"
            ? `Our LLM has reviewed the discovery requests and flagged all violations for CCP 2030.060 clause f. To generate motion draft please click on the generate button.`
            : `Our LLM has reviewed the discovery requests and flagged all violations for CCP 2030.060 clause f. To generate motion draft please click on the generate button.`}
        </p>

        <Accordion.Root type="multiple" className="transition-all ease-in">
          {reviews.map((item) => (
            <Accordion.Item
              value={item.questionNumber}
              className=" border-b border-slate-100"
            >
              <Accordion.Header>
                <Accordion.Trigger className="text-left flex items-start gap-2">
                  <div className="text-2xl py-3 px-1">
                    {item.passFail === "Pass" ? (
                      <FaCheckCircle className="text-red-600" />
                    ) : (
                      <FaTimesCircle className="text-green-600" />
                    )}
                  </div>
                  <div className="p-2">{item.question}</div>
                  <div className="flex justify-center items-center p-2 text-gray-500">
                    <FaCaretDown />
                  </div>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="p-4 ">
                <div className="bg-blue-50 text-sm p-4 ml-7">
                  {item.analysis}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    );
  };

  const [copiedText, copy] = useCopyToClipboard();
  const handleClickCopy = async () => {
    try {
      await copy(draft);
      toast.success("Successfully copied motion 🎉");
    } catch (err) {
      toast.success("Failed to copy motion 🎉");
    }
  };
  const renderDraft = () => {
    if (loadingReview) {
      return (
        <>
          <h1 className="text-3xl">Generate Motion</h1>
          <div className="h-[500px] flex justify-center items-center">
            <div className="flex gap-0.25 items-center">
              <Spinner />
              <div className="text-sm text-gray-500">
                Generating motion draft...
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <div>
        <h1 className="text-3xl">Generate Motion</h1>
        <p className="my-4 text-sm text-gray-500">
          {type === "respond"
            ? `Our LLM has generated the subsections for your motion draft based on all discovery requests that are violating CCP 2030.060 clause f. To copy draft, click on the copy button.`
            : `Our LLM has generated the subsections for your motion draft based on all discovery requests that are violating CCP 2030.060 clause f. To copy draft, click on the copy button.`}
        </p>
        <div className="my-8">
          <textarea
            className="w-full h-[500px] border border-gray-200 p-3 rounded"
            value={draft}
            readOnly
          />
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col justify-end items-end">
            <button className="btn-blue" onClick={handleClickCopy}>
              Copy Motion
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch (view) {
      case "data":
        return renderDiscoveryRequestForm();
      case "review":
        return renderViolations();
      case "export":
        return renderDraft();
      default:
        return <p>View cannot be found</p>;
    }
  };

  return (
    <div className="flex mx-auto max-w-6xl">
      <Stepper
        title={type === "respond" ? "Respond Discovery" : "Propound Discovery"}
        view={view}
      />
      <div className="py-6 px-8 w-full">{renderView()}</div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default MotionDrafter;