import React, { useState } from "react";
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
import { Plus, Trash2, Edit, Check } from "lucide-react";
import { toast } from "sonner";

const TestModal = ({ isOpen, onClose, onSave }) => {
  const [testType, setTestType] = useState("pre");
  const [questions, setQuestions] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

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
    const isValid = questions.every(
      (q) =>
        q.text.trim() !== "" &&
        q.answers.length >= 2 &&
        q.answers.every((a) => a.text.trim() !== "") &&
        q.correctAnswerId
    );

    if (!isValid) {
      toast.error(
        "Please fill in all question and answer fields, and select a correct answer for each question."
      );
      return;
    }

    onSave({ type: testType, questions });

    handleClose();
  };

  const handleClose = () => {
    setTestType("pre");
    setQuestions([]);
    setEditingQuestionId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[800px] h-[90vh] flex flex-col bg-customgreys-darkGrey border-none"
        data-state="static"
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            Create a {testType.toUpperCase()} Test
          </DialogTitle>
          <DialogDescription>
            Design a multiple-choice test with questions and answers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-grow overflow-hidden">
          <div>
            <Label className="text-white text-md">Test Type</Label>
            <Select
              value={testType}
              onValueChange={(value) => setTestType(value)}
            >
              <SelectTrigger className="w-full bg-customgreys-primarybg text-white border-none mt-2">
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent className="bg-customgreys-primarybg text-white border-customgreys-dirtyGrey">
                <SelectItem value="pre">Pre-Test</SelectItem>
                <SelectItem value="post">Post-Test</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-300px)] space-y-4 pr-2">
            {questions.map((question, qIndex) => (
              <div
                key={question.id}
                className={`bg-customgreys-primarybg p-4 rounded-lg space-y-3 transition-all duration-300 ${
                  editingQuestionId === question.id
                    ? "ring-2 ring-primary-700"
                    : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <Label className="text-white">Question {qIndex + 1}</Label>
                  <div className="flex items-center space-x-2">
                    {editingQuestionId !== question.id ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingQuestionId(question.id)}
                        className="text-primary-700 hover:bg-primary-100"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingQuestionId(null)}
                        className="text-green-500 hover:bg-green-100"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-500 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {editingQuestionId === question.id ? (
                  <>
                    <Input
                      placeholder="Enter question text"
                      value={question.text}
                      onChange={(e) =>
                        updateQuestion(question.id, e.target.value)
                      }
                      className="bg-customgreys-darkGrey text-white border-none"
                    />

                    <div className="space-y-2">
                      <Label className="text-white">Answers</Label>
                      {question.answers.map((answer, aIndex) => (
                        <div
                          key={answer.id}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            placeholder={`Answer ${aIndex + 1}`}
                            value={answer.text}
                            onChange={(e) =>
                              updateAnswer(
                                question.id,
                                answer.id,
                                e.target.value
                              )
                            }
                            className="bg-customgreys-darkGrey text-white border-none flex-grow"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAnswer(question.id, answer.id)}
                            className="text-red-500 hover:bg-red-100"
                            disabled={question.answers.length <= 2}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <input
                            type="radio"
                            name={`correct_${question.id}`}
                            checked={question.correctAnswerId === answer.id}
                            onChange={() =>
                              setCorrectAnswer(question.id, answer.id)
                            }
                            className="text-primary-700"
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addAnswer(question.id)}
                        className="mt-2 border-primary-700 text-primary-700"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Answer
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-white">
                    <p className="font-semibold">{question.text}</p>
                    <div className="mt-2 space-y-1">
                      {question.answers.map((answer) => (
                        <div
                          key={answer.id}
                          className={`p-2 rounded ${
                            answer.id === question.correctAnswerId
                              ? "bg-green-500/20"
                              : "bg-customgreys-darkGrey"
                          }`}
                        >
                          {answer.text}
                          {answer.id === question.correctAnswerId && (
                            <span className="ml-2 text-xs text-green-500">
                              (Correct)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={addQuestion}
            className="w-full border-primary-700 text-primary-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-white hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary-700 hover:bg-primary-600"
          >
            Save Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestModal;
