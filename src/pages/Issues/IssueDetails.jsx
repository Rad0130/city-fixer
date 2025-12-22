import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from '../../Hooks/useAxios';
import {
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  User,
  ArrowLeft,
  Trash2,
  Edit3,
  Zap,
  MapPin,
  ThumbsUp,
  Image as ImageIcon
} from 'lucide-react';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth';

const IssueDetails = () => {
  const { id } = useParams();
  const axios = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {user}=useAuth();

  // Fetch single issue data
  const { data: issues, isLoading, error } = useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      const res = await axios.get(`/issues?_id=${id}`);
      return res.data;
    }
  });

  // Extract the single issue from the array
  const issue = issues && issues.length > 0 ? issues[0] : null;

  console.log('Issues array:', issues);
  console.log('Extracted issue:', issue);
  console.log('Issue description:', issue?.description);

  // Mutation for Deleting
  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`/issues/${id}`),
    onSuccess: () => {
      Swal.fire('Deleted!', 'The issue has been removed.', 'success');
      navigate('/all-issues');
    }
  });

  // Mutation for Boosting Priority
  const boostMutation = useMutation({
    mutationFn: () => axios.patch(`/issues/${id}`, { priority: 'High' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['issue', id]);
      Swal.fire('Boosted!', 'Issue priority set to High.', 'success');
    }
  });

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="loading loading-bars loading-lg text-primary"></span>
    </div>
  );

  if (error) return <div className="text-center mt-20 text-error">Issue not found.</div>;

  // Check if issue exists
  if (!issue) return (
    <div className="text-center mt-20">
      <div className="alert alert-error max-w-md mx-auto">
        <AlertCircle size={24} />
        <span>Issue not found or has been removed.</span>
      </div>
      <button 
        onClick={() => navigate('/all-issues')}
        className="btn btn-primary mt-4"
      >
        Back to All Issues
      </button>
    </div>
  );

  const getPriorityColor = (p) => p === 'High' ? 'badge-error' : 'badge-warning';
  const getStatusColor = (s) => {
    if (s === 'Resolved') return 'badge-success';
    if (s === 'In Progress') return 'badge-info';
    return 'badge-ghost';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-10">
      {/* Back Button & Actions */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost gap-2"
        >
          <ArrowLeft size={18} /> Back to List
        </button>

        {
            user.email===issue.reportedBy && <div className="flex gap-2">
          <button
            onClick={() => navigate(`/edit-issue/${id}`)}
            className="btn btn-outline btn-sm md:btn-md gap-2"
          >
            <Edit3 size={18} /> Edit
          </button>
          <button
            onClick={() => {
              Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) deleteMutation.mutate();
              })
            }}
            className="btn btn-error btn-outline btn-sm md:btn-md gap-2"
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              {/* Status, Priority, and Upvotes */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className={`badge ${getStatusColor(issue.status)} badge-lg font-bold`}>
                    {issue.status}
                  </span>
                  <span className={`badge ${getPriorityColor(issue.priority)} badge-lg font-bold`}>
                    {issue.priority} Priority
                  </span>
                </div>
                
                {/* Upvotes Display */}
                <div className="flex items-center gap-2 px-4 py-2 bg-base-200 rounded-full">
                  <ThumbsUp size={20} className="text-primary" />
                  <span className="font-bold text-lg">{issue.upvotes || 0}</span>
                  <span className="text-sm opacity-70">upvotes</span>
                </div>
              </div>

              {/* Issue Title */}
              <h1 className="card-title text-3xl md:text-4xl font-extrabold mb-2">
                {issue.title}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-2 mb-6">
                <MapPin size={18} className="text-gray-500" />
                <span className="text-lg text-gray-600">{issue.location}</span>
              </div>

              {/* Image Section */}
              {issue.image && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon size={20} className="text-gray-500" />
                    <h3 className="font-bold text-lg">Issue Image</h3>
                  </div>
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={issue.image}
                      alt={`Image of ${issue.title}`}
                      className="w-full h-auto max-h-[500px] object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Image submitted by reporter
                  </p>
                </div>
              )}

              {/* Description Section */}
              <div className="space-y-4">
                <div className="divider">
                  <h3 className="text-xl font-bold">Description</h3>
                </div>
                
                <div className="bg-base-100 rounded-xl p-6 border border-base-300">
                  <p className="text-lg leading-relaxed text-base-content/90 whitespace-pre-line">
                    {issue.description || "No detailed description provided for this issue."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info & Actions */}
        <div className="space-y-6">
          {/* Details Card */}
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <h3 className="font-bold text-xl mb-6 pb-2 border-b">Issue Details</h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary mt-1">
                    <Tag size={20} />
                  </div>
                  <div>
                    <p className="text-xs opacity-60 uppercase font-bold">Category</p>
                    <p className="font-medium text-lg">{issue.category}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg text-secondary mt-1">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs opacity-60 uppercase font-bold">Reported By</p>
                    <p className="font-medium text-lg break-all">{issue.reportedBy || 'Anonymous'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent mt-1">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs opacity-60 uppercase font-bold">Reported Date</p>
                    <p className="font-medium">
                      {issue.createdAt 
                        ? new Date(issue.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Date not available'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-success/10 rounded-lg text-success mt-1">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs opacity-60 uppercase font-bold">Last Updated</p>
                    <p className="font-medium">
                      {issue.updatedAt 
                        ? new Date(issue.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Date not available'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="divider">Quick Actions</div>

              <button
                onClick={() => boostMutation.mutate()}
                disabled={issue.priority === 'High' || boostMutation.isLoading}
                className={`btn w-full gap-2 shadow-lg ${
                  issue.priority === 'High' 
                    ? 'btn-success' 
                    : 'btn-primary'
                }`}
              >
                <Zap size={18} fill={issue.priority === 'High' ? "currentColor" : "none"} />
                {boostMutation.isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : issue.priority === 'High' ? (
                  '✓ Priority Already High'
                ) : (
                  'Boost Priority to High'
                )}
              </button>

              <p className="text-xs text-center mt-3 opacity-50 italic">
                Boosting moves this issue to the top of the admin queue for faster resolution.
              </p>
            </div>
          </div>

          {/* Support Box */}
          <div className="alert shadow-sm border border-info/20 bg-info/5">
            <AlertCircle className="stroke-info" size={24} />
            <div>
              <h3 className="font-bold">Need immediate help?</h3>
              <div className="text-xs">
                Contact city council support if this issue poses immediate danger or requires urgent attention.
              </div>
              <button className="btn btn-sm btn-info mt-2">
                Contact Support
              </button>
            </div>
          </div>

          {/* Share & Community Actions */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h3 className="font-bold text-lg mb-4">Community Actions</h3>
              <div className="flex gap-2">
                <button className="btn btn-outline btn-sm flex-1">
                  Share Issue
                </button>
                <button className="btn btn-primary btn-sm flex-1">
                  Follow Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;