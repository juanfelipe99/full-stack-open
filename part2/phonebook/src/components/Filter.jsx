const Filter = ({ filter, handleFilterChange }) => (
    <form>
      <div>
        filter shown with: <input value={filter} onChange={handleFilterChange} />
      </div>
    </form>
);
  
export default Filter;
  