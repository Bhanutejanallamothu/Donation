
    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { DatePicker } from '@/components/ui/date-picker';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { useTasks } from '@/context/TaskContext';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { PlusCircle } from 'lucide-react';

    const CreateTaskPage = () => {
      const navigate = useNavigate();
      const { addTask } = useTasks();
      const { toast } = useToast();

      const [title, setTitle] = useState('');
      const [description, setDescription] = useState('');
      const [dueDate, setDueDate] = useState(null);
      const [priority, setPriority] = useState('Medium');
      const [project, setProject] = useState('');
      const [status, setStatus] = useState('To Do');


      const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !dueDate) {
          toast({
            title: "Missing Information",
            description: "Please fill in the title and due date.",
            variant: "destructive",
          });
          return;
        }
        addTask({ title, description, dueDate: dueDate.toISOString(), priority, project, status });
        navigate('/tasks');
      };

      const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      };
      
      const inputMotionProps = {
        whileHover: { scale: 1.02 },
        whileFocus: { scale: 1.02, boxShadow: "0px 0px 8px rgba(var(--primary-rgb), 0.5)" }
      };


      return (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={formVariants}
          className="max-w-2xl mx-auto"
        >
          <Card className="professional-card shadow-xl">
            <CardHeader className="text-center">
              <div className="inline-block mx-auto p-3 bg-primary/10 rounded-full mb-3">
                 <PlusCircle className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold gradient-text">Create New Task</CardTitle>
              <CardDescription className="text-lg text-foreground/70">Fill in the details below to add a new task to your list.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-foreground/90">Title</Label>
                  <motion.div {...inputMotionProps}>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Finalize project report"
                      className="mt-1 professional-input"
                      required
                    />
                  </motion.div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-foreground/90">Description</Label>
                   <motion.div {...inputMotionProps}>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add more details about the task..."
                      className="mt-1 min-h-[100px] professional-input"
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="dueDate" className="text-sm font-medium text-foreground/90">Due Date</Label>
                        <motion.div {...inputMotionProps}>
                            <DatePicker date={dueDate} setDate={setDueDate} className="mt-1 w-full professional-input" />
                        </motion.div>
                    </div>
                    <div>
                        <Label htmlFor="priority" className="text-sm font-medium text-foreground/90">Priority</Label>
                        <motion.div {...inputMotionProps}>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger className="w-full mt-1 professional-input">
                                <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover text-popover-foreground">
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </motion.div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="project" className="text-sm font-medium text-foreground/90">Project / Category</Label>
                         <motion.div {...inputMotionProps}>
                            <Input
                            id="project"
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                            placeholder="e.g., Q4 Marketing Campaign"
                            className="mt-1 professional-input"
                            />
                        </motion.div>
                    </div>
                     <div>
                        <Label htmlFor="status" className="text-sm font-medium text-foreground/90">Status</Label>
                        <motion.div {...inputMotionProps}>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full mt-1 professional-input">
                                <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover text-popover-foreground">
                                <SelectItem value="To Do">To Do</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </motion.div>
                    </div>
                </div>


                <div className="flex justify-end space-x-3 pt-4">
                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button type="button" variant="outline" onClick={() => navigate(-1)} className="px-6 py-2 text-base">
                        Cancel
                    </Button>
                   </motion.div>
                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button type="submit" className="px-8 py-2 text-base bg-primary hover:bg-primary/90">
                        Add Task
                    </Button>
                   </motion.div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default CreateTaskPage;
  