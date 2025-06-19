"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  Edit,
  Check,
  FileText,
  HelpCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getTestDetails } from "@/lib/actions/speaker/action";

const TestModal = ({
  isOpen,
  onClose,
  onSave,
  editingTest = null,
  testId = null,
}) => {
  const [testType, setTestType] = useState("pre");
  const [testTitle, setTestTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Helper function to transform API data to component format
  const transformApiDataToComponentFormat = (apiData) => {
    return {
      ...apiData,
      questions:
        apiData.questions?.map((question) => ({
          id: question.question_id?.toString() || `q_${Date.now()}`,
          text: question.question_text || "",
          answers:
            question.choices?.map((choice) => ({
              id: choice.choice_id?.toString() || `a_${Date.now()}`,
              text: choice.choice_text || "",
            })) || [],
          correctAnswerId: question.choices
            ?.find((choice) => choice.is_correct === 1)
            ?.choice_id?.toString(),
        })) || [],
    };
  };

  // Effect to load test data when editing
  useEffect(() => {
    const loadTestData = async () => {
      if (isOpen) {
        setLoadError(null);

        // Case 1: Editing with testId - fetch from API
        if (testId && !editingTest) {
          setIsLoading(true);
          try {
            const { success, data, message } = await getTestDetails(
              testId.test_id
            );

            if (!success) {
              setLoadError(message || "Failed to load test details");
              return toast.error("Failed to load test details");
            }

            // Transform API data to component format
            const transformedData = transformApiDataToComponentFormat(data);

            setTestType(transformedData.test_type || "pre");
            setTestTitle(transformedData.test_title || "");
            setQuestions(transformedData.questions || []);
          } catch (error) {
            console.error("Error loading test details:", error);
            setLoadError("Error loading test details");
            toast.error("Error loading test details");
          } finally {
            setIsLoading(false);
          }
        }
        // Case 2: Editing with existing test data
        else if (editingTest && !testId) {
          console.log("Using existing editingTest data:", editingTest);

          // Check if editingTest is already in component format or API format
          let transformedData;
          if (editingTest.questions && editingTest.questions[0]?.choices) {
            // API format - transform it
            transformedData = transformApiDataToComponentFormat(editingTest);
          } else {
            // Already in component format
            transformedData = editingTest;
          }

          setTestType(
            transformedData.type ||
              transformedData.test_type?.replace("-test", "") ||
              "pre"
          );
          setTestTitle(
            transformedData.title || transformedData.test_title || ""
          );
          setQuestions(transformedData.questions || []);
        }
        // Case 3: Creating new test
        else if (!editingTest && !testId) {
          setTestType("pre");
          setTestTitle("");
          setQuestions([]);
          setEditingQuestionId(null);
        }
      }
    };

    loadTestData();
  }, [editingTest, testId, isOpen]);

  // Reset modal when closed
  useEffect(() => {
    if (!isOpen) {
      setTestTitle("");
      setTestType("pre");
      setQuestions([]);
      setEditingQuestionId(null);
      setIsLoading(false);
      setLoadError(null);
    }
  }, [isOpen]);

  const addQuestion = () => {
    const newQuestion = {
      id: `q_${Date.now()}`,
      text: "",
      answers: [
        { id: `a_${Date.now()}_1`, text: "" },
        { id: `a_${Date.now()}_2`, text: "" },
      ],
    };
    setQuestions([...questions, newQuestion]);
    setEditingQuestionId(newQuestion.id);
  };

  const updateQuestion = (questionId, text) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, text } : q))
    );
  };

  const addAnswer = (questionId) => {
    const newAnswer = {
      id: `a_${Date.now()}`,
      text: "",
    };
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, answers: [...q.answers, newAnswer] } : q
      )
    );
  };

  const updateAnswer = (questionId, answerId, text) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, text } : a
              ),
            }
          : q
      )
    );
  };

  const setCorrectAnswer = (questionId, answerId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, correctAnswerId: answerId } : q
      )
    );
  };

  const removeQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
    if (editingQuestionId === questionId) {
      setEditingQuestionId(null);
    }
  };

  const removeAnswer = (questionId, answerId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.filter((a) => a.id !== answerId),
              correctAnswerId:
                q.correctAnswerId === answerId ? undefined : q.correctAnswerId,
            }
          : q
      )
    );
  };

  const handleSave = () => {
    const isValid =
      testTitle.trim() !== "" &&
      questions.every(
        (q) =>
          q.text?.trim() !== "" && 
          q.answers?.length >= 2 && 
          q.answers.every((a) => a.text?.trim() !== "") &&
          q.correctAnswerId
      );

    if (!isValid) {
      toast.error(
        "Please fill in the test title, all question and answer fields, and select a correct answer for each question."
      );
      return;
    }

    const testData = {
      test_title: testTitle,
      test_type: testType,
      questions,
      ...(editingTest && { test_id: editingTest.test_id }),
      ...(testId && { test_id: testId }),
    };

    onSave(testData);
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  const getQuestionStatus = (question) => {
    const hasText = question.text?.trim() !== ""; // Added optional chaining
    const hasValidAnswers =
      question.answers?.length >= 2 && // Added optional chaining
      question.answers.every((a) => a.text?.trim() !== ""); // Added optional chaining
    const hasCorrectAnswer = question.correctAnswerId;
    return hasText && hasValidAnswers && hasCorrectAnswer;
  };

  // Loading state
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md bg-slate-900 border border-slate-700 rounded-xl">
          <DialogTitle>LOADING</DialogTitle>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            <div className="text-white text-lg font-medium">
              Loading test details...
            </div>
            <div className="text-slate-400 text-sm">
              Please wait while we fetch the test data
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (loadError) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md bg-slate-900 border border-slate-700 rounded-xl">
          <DialogTitle>SOMETHING WENT WRONG</DialogTitle>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-red-400" />
            </div>
            <div className="text-white text-lg font-medium">
              Failed to load test
            </div>
            <div className="text-slate-400 text-sm text-center">
              {loadError}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Retry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-xl shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-white text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-violet-400" />
            {editingTest || testId
              ? `Edit ${testType.toUpperCase()} Test`
              : `Create a ${testType.toUpperCase()} Test`}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {editingTest || testId
              ? "Modify your existing test"
              : "Design a multiple-choice test with questions and answers"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 gap-6 min-h-0">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col space-y-4 min-w-0">
            {/* Test Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white text-sm font-medium">
                  Test Type
                </Label>
                <Select
                  value={testType}
                  onValueChange={(value) => setTestType(value)}
                >
                  <SelectTrigger className="w-full bg-slate-800 text-white border-slate-600 mt-2 focus:ring-violet-500">
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white border-slate-600">
                    <SelectItem value="pre">Pre-Test</SelectItem>
                    <SelectItem value="post">Post-Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white text-sm font-medium">
                  Test Title
                </Label>
                <Input
                  placeholder="Enter test title"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="w-full bg-slate-800 text-white border-slate-600 mt-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>
            </div>

            {/* Questions Area */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Questions</h3>
                <Button
                  onClick={addQuestion}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Question
                </Button>
              </div>

              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {questions.map((question, qIndex) => (
                    <div
                      key={question.id}
                      className={`bg-slate-800 p-5 rounded-xl space-y-4 transition-all duration-300 border ${
                        editingQuestionId === question.id
                          ? "ring-2 ring-violet-500 border-violet-500"
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Label className="text-white font-medium">
                            Question {qIndex + 1}
                          </Label>
                          {getQuestionStatus(question) && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {editingQuestionId !== question.id ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingQuestionId(question.id)}
                              className="text-violet-400 hover:bg-violet-500/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingQuestionId(null)}
                              className="text-green-400 hover:bg-green-500/20"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {editingQuestionId === question.id ? (
                        <>
                          <Input
                            placeholder="Enter question text"
                            value={question.text || ""}
                            onChange={(e) =>
                              updateQuestion(question.id, e.target.value)
                            }
                            className="bg-slate-900 text-white border-slate-600 focus:ring-violet-500 focus:border-violet-500"
                          />

                          <div className="space-y-3">
                            <Label className="text-white text-sm font-medium">
                              Answers
                            </Label>
                            {question.answers?.map(
                              (
                                answer,
                                aIndex // Added optional chaining
                              ) => (
                                <div
                                  key={answer.id}
                                  className="flex items-center space-x-3"
                                >
                                  <div className="flex items-center space-x-2 flex-1">
                                    <span className="text-slate-400 text-sm w-6">
                                      {String.fromCharCode(65 + aIndex)}.
                                    </span>
                                    <Input
                                      placeholder={`Answer ${aIndex + 1}`}
                                      value={answer.text || ""} // Added fallback
                                      onChange={(e) =>
                                        updateAnswer(
                                          question.id,
                                          answer.id,
                                          e.target.value
                                        )
                                      }
                                      className="bg-slate-900 text-white border-slate-600 focus:ring-violet-500 focus:border-violet-500 flex-1"
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name={`correct_${question.id}`}
                                      checked={
                                        question.correctAnswerId === answer.id
                                      }
                                      onChange={() =>
                                        setCorrectAnswer(question.id, answer.id)
                                      }
                                      className="w-4 h-4 text-violet-600 bg-slate-900 border-slate-600 focus:ring-violet-500"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        removeAnswer(question.id, answer.id)
                                      }
                                      className="text-red-400 hover:bg-red-500/20 h-8 w-8"
                                      disabled={question.answers?.length <= 2} // Added optional chaining
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addAnswer(question.id)}
                              className="mt-2 border-violet-500 text-violet-400 hover:bg-violet-500/10"
                            >
                              <Plus className="mr-2 h-3 w-3" /> Add Answer
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-white">
                          <p className="font-medium mb-3">
                            {question.text || "No question text"}
                          </p>
                          <div className="space-y-2">
                            {question.answers?.map(
                              (
                                answer,
                                aIndex // Added optional chaining
                              ) => (
                                <div
                                  key={answer.id}
                                  className={`p-3 rounded-lg flex items-center gap-2 ${
                                    answer.id === question.correctAnswerId
                                      ? "bg-green-500/20 border border-green-500/50"
                                      : "bg-slate-900 border border-slate-700"
                                  }`}
                                >
                                  <span className="text-slate-400 text-sm w-6">
                                    {String.fromCharCode(65 + aIndex)}.
                                  </span>
                                  <span className="flex-1">
                                    {answer.text || "No answer text"}
                                  </span>
                                  {answer.id === question.correctAnswerId && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-green-500/20 text-green-400 border-green-500/50"
                                    >
                                      Correct
                                    </Badge>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {questions.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">No questions added yet</p>
                      <p className="text-sm">
                        Click "Add Question" to get started
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Right Sidebar */}
          <div
            className="w-80 bg-slate-800 rounded-xl p-4 flex flex-col overflow-auto 
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-violet-400" />
              <h3 className="text-white font-semibold">Test Overview</h3>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <Label className="text-slate-300 text-xs uppercase tracking-wide">
                  Title
                </Label>
                <p className="text-white font-medium">
                  {testTitle || "Untitled Test"}
                </p>
              </div>
              <div>
                <Label className="text-slate-300 text-xs uppercase tracking-wide">
                  Type
                </Label>
                <Badge
                  variant="secondary"
                  className="bg-violet-500/20 text-violet-300"
                >
                  {testType.toUpperCase()}
                </Badge>
              </div>
              <div>
                <Label className="text-slate-300 text-xs uppercase tracking-wide">
                  Questions
                </Label>
                <p className="text-white font-medium">
                  {questions.length} question{questions.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <Separator className="bg-slate-700 mb-4" />

            <div className="flex-1">
              <Label className="text-slate-300 text-xs uppercase tracking-wide mb-3 block">
                Question List
              </Label>
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        editingQuestionId === question.id
                          ? "bg-violet-500/20 border-violet-500"
                          : "bg-slate-900 border-slate-700 hover:border-slate-600"
                      }`}
                      onClick={() => setEditingQuestionId(question.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-medium">
                          Q{index + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          {getQuestionStatus(question) ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-slate-600" />
                          )}
                        </div>
                      </div>
                      <p className="text-slate-300 text-xs line-clamp-2">
                        {question.text || "No question text"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-slate-400 text-xs">
                          {question.answers?.length || 0} answers{" "}
                          {/* Added optional chaining and fallback */}
                        </span>
                        {question.correctAnswerId && (
                          <Badge
                            variant="secondary"
                            className="bg-green-500/20 text-green-400 text-xs"
                          >
                            ✓
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {editingTest || testId ? "Update Test" : "Save Test"} (
            {questions.length} question
            {questions.length !== 1 ? "s" : ""})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestModal;
