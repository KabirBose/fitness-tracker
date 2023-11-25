function confirmDelete(workoutId) {
  // Display a confirmation dialog
  if (confirm("Are you sure you want to delete this workout?")) {
    // If the user clicks OK, call the deleteWorkout function with the workoutId
    deleteWorkout(workoutId);
  }
}

// Function to delete the workout
function deleteWorkout(workoutId) {
  // Use fetch to make a DELETE request to the server
  fetch(`/exercises/delete/${workoutId}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) {
      // Redirect to the exercises page after successful deletion
    window.location.href = "/exercises";
    }
  })
  .catch(error => {
    // Handle errors
    console.error('Error deleting workout:', error);
    alert('Error deleting workout. Please try again.');
  });
}
