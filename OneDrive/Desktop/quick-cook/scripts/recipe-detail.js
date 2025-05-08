// Recipe Detail Page JavaScript

// Extended recipe data with more details
const recipeDetails = {
    1: {
        id: 1,
        title: "Pasta with Tomato Sauce",
        time: 25,
        servings: 4,
        difficulty: "Easy",
        image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "This classic Italian pasta dish combines al dente pasta with a rich, flavorful tomato sauce. It's simple to make but incredibly satisfying, perfect for a quick weeknight dinner or as a base for more elaborate pasta dishes.",
        ingredients: [
            { name: "pasta", quantity: "400g", substitute: "any pasta shape works" },
            { name: "tomatoes", quantity: "800g", substitute: "canned tomatoes" },
            { name: "garlic", quantity: "3 cloves", substitute: "garlic powder" },
            { name: "olive oil", quantity: "3 tbsp", substitute: "vegetable oil" },
            { name: "basil", quantity: "handful", substitute: "dried basil or oregano" },
            { name: "salt", quantity: "to taste" },
            { name: "pepper", quantity: "to taste" }
        ],
        steps: [
            { 
                instruction: "Bring a large pot of salted water to a boil. Add pasta and cook according to package instructions until al dente.",
                image: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
            },
            { 
                instruction: "While pasta is cooking, heat olive oil in a large pan over medium heat. Add minced garlic and cook until fragrant, about 1 minute.",
                image: "" 
            },
            { 
                instruction: "Add tomatoes (crushed or diced) to the pan. If using whole tomatoes, break them up with a wooden spoon. Season with salt and pepper.",
                image: "https://images.unsplash.com/photo-1604177091072-2f9a9473ceb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
            },
            { 
                instruction: "Simmer the sauce for about 15 minutes, stirring occasionally, until it thickens slightly.",
                image: "" 
            },
            { 
                instruction: "Drain pasta and add it to the sauce. Toss to combine and coat pasta evenly. Add torn basil leaves and stir gently.",
                image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
            },
            { 
                instruction: "Serve immediately with grated Parmesan cheese if desired.",
                image: "" 
            }
        ],
        cuisine: "italian",
        dietaryRestrictions: ["vegetarian"],
        nutritionalInfo: {
            calories: 450,
            protein: 12,
            carbs: 70,
            fat: 12,
            fiber: 4,
            sugar: 6
        },
        culturalInfo: "Pasta with tomato sauce is a staple of Italian cuisine, particularly from the southern regions. While seemingly simple, this dish showcases the Italian philosophy of cooking: using few, high-quality ingredients to create something extraordinary. Tomato sauce (or 'sugo di pomodoro') became popular in Italy after tomatoes were introduced from the Americas in the 16th century."
    },
    2: {
        id: 2,
        title: "Chicken Stir Fry",
        time: 30,
        servings: 3,
        difficulty: "Medium",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "This quick and flavorful stir fry combines tender chicken pieces with crisp vegetables in a savory sauce. It's a balanced one-pan meal that's perfect for busy weeknights when you need dinner on the table fast.",
        ingredients: [
            { name: "chicken breast", quantity: "450g", substitute: "thigh meat or tofu" },
            { name: "bell pepper", quantity: "1 large", substitute: "any color pepper" },
            { name: "broccoli", quantity: "1 head", substitute: "cauliflower" },
            { name: "soy sauce", quantity: "3 tbsp", substitute: "tamari or coconut aminos" },
            { name: "rice", quantity: "2 cups cooked", substitute: "noodles or quinoa" },
            { name: "garlic", quantity: "2 cloves", substitute: "garlic powder" },
            { name: "ginger", quantity: "1 tbsp grated", substitute: "ginger powder" },
            { name: "vegetable oil", quantity: "2 tbsp" },
            { name: "sesame oil", quantity: "1 tsp", substitute: "any oil" }
        ],
        steps: [
            {
                instruction: "Cut chicken into bite-sized pieces. Season with salt and pepper.",
                image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            },
            {
                instruction: "Heat vegetable oil in a large wok or pan over high heat. Add chicken and cook until golden and cooked through, about 5-6 minutes.",
                image: ""
            },
            {
                instruction: "Remove chicken and set aside. In the same pan, add a bit more oil if needed, then add garlic and ginger. Stir for 30 seconds until fragrant.",
                image: ""
            },
            {
                instruction: "Add broccoli and bell pepper. Stir-fry for 3-4 minutes until vegetables are crisp-tender.",
                image: "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            },
            {
                instruction: "Return chicken to the pan. Add soy sauce and stir to combine. Cook for 2 more minutes.",
                image: ""
            },
            {
                instruction: "Drizzle with sesame oil before serving. Serve hot over cooked rice.",
                image: "https://images.unsplash.com/photo-1619894991209-32c6967b6578?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
            }
        ],
        cuisine: "asian",
        dietaryRestrictions: ["dairy-free"],
        nutritionalInfo: {
            calories: 380,
            protein: 28,
            carbs: 30,
            fat: 14,
            fiber: 5,
            sugar: 4
        },
        culturalInfo: "Stir frying is a cooking technique that originated in China over 2,000 years ago. It became popular due to its efficiency with fuel, as quick cooking over high heat requires less energy than long-simmering dishes. The method spread throughout East and Southeast Asia, with each region developing its own characteristic flavors and ingredients."
    }
};

// DOM elements
let recipeDetail;
let breadcrumbTitle;
let relatedRecipes;
let currentServings = 4;

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    recipeDetail = document.getElementById('recipe-detail');
    breadcrumbTitle = document.getElementById('recipe-title-breadcrumb');
    relatedRecipes = document.getElementById('related-recipes');
    
    // Get recipe ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get('id'));
    
    if (recipeId && recipeDetails[recipeId]) {
        loadRecipeDetail(recipeId);
        loadRelatedRecipes(recipeId);
    } else {
        // If no valid recipe ID, redirect to home or show error
        recipeDetail.innerHTML = `
            <div class="no-recipe-error">
                <h2>Recipe Not Found</h2>
                <p>Sorry, the recipe you're looking for doesn't exist or has been removed.</p>
                <a href="index.html" class="search-btn">Return to Home</a>
            </div>
        `;
    }
    
    // Setup event listeners for page buttons
    document.getElementById('save-recipe').addEventListener('click', saveRecipe);
    document.getElementById('share-recipe').addEventListener('click', shareRecipe);
    document.getElementById('print-recipe').addEventListener('click', printRecipe);
});

// Load and display the recipe details
function loadRecipeDetail(recipeId) {
    const recipe = recipeDetails[recipeId];
    
    if (!recipe) return;
    
    // Update page title and breadcrumb
    document.title = `${recipe.title} - Quick Cook`;
    breadcrumbTitle.textContent = recipe.title;
    
    // Create recipe detail HTML
    const recipeHTML = `
        <div class="recipe-header">
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-cover">
            <div class="recipe-title-container">
                <h1 class="recipe-title">${recipe.title}</h1>
                <div class="recipe-tags">
                    ${recipe.dietaryRestrictions.map(diet => 
                        `<span class="recipe-tag">${diet}</span>`
                    ).join('')}
                    <span class="recipe-tag">${recipe.cuisine}</span>
                </div>
            </div>
        </div>
        
        <div class="recipe-info-bar">
            <div class="recipe-info-item">
                <i class="fas fa-clock"></i>
                <span class="recipe-info-label">Time</span>
                <span class="recipe-info-value">${recipe.time} mins</span>
            </div>
            <div class="recipe-info-item">
                <i class="fas fa-utensils"></i>
                <span class="recipe-info-label">Difficulty</span>
                <span class="recipe-info-value">${recipe.difficulty}</span>
            </div>
            <div class="recipe-info-item">
                <i class="fas fa-users"></i>
                <span class="recipe-info-label">Servings</span>
                <span class="recipe-info-value">${recipe.servings}</span>
            </div>
            <div class="recipe-info-item">
                <i class="fas fa-fire"></i>
                <span class="recipe-info-label">Calories</span>
                <span class="recipe-info-value">${recipe.nutritionalInfo.calories}/serving</span>
            </div>
        </div>
        
        <div class="recipe-content-grid">
            <div class="recipe-main-content">
                <div class="recipe-description">
                    ${recipe.description}
                </div>
                
                <div class="recipe-instructions">
                    <h2 class="recipe-section-title">Instructions</h2>
                    <ol class="recipe-steps">
                        ${recipe.steps.map(step => `
                            <li class="recipe-step">
                                <p>${step.instruction}</p>
                                ${step.image ? `<img src="${step.image}" alt="Step" class="recipe-step-image">` : ''}
                            </li>
                        `).join('')}
                    </ol>
                </div>
                
                <div class="cultural-info">
                    <h3>Cultural Background</h3>
                    <p>${recipe.culturalInfo}</p>
                </div>
            </div>
            
            <div class="recipe-sidebar">
                <div class="serving-adjuster">
                    <span class="serving-label">Servings</span>
                    <div class="serving-controls">
                        <button class="serving-btn" id="decrease-serving">-</button>
                        <span class="serving-count" id="serving-count">${recipe.servings}</span>
                        <button class="serving-btn" id="increase-serving">+</button>
                    </div>
                </div>
                
                <div class="recipe-ingredients">
                    <h2 class="recipe-section-title">Ingredients</h2>
                    <ul class="ingredient-list">
                        ${recipe.ingredients.map(ingredient => `
                            <li class="ingredient-item">
                                <span class="ingredient-name">${ingredient.name}</span>
                                <span class="ingredient-quantity">${ingredient.quantity}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="substitutions">
                    <h2 class="recipe-section-title">Substitutions</h2>
                    <ul class="substitution-list">
                        ${recipe.ingredients.filter(ing => ing.substitute).map(ingredient => `
                            <li class="substitution-item">
                                <span class="original-ingredient">${ingredient.name}</span>
                                <span class="substitute-ingredient">${ingredient.substitute}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="nutrition-facts">
                    <h2 class="recipe-section-title">Nutrition Facts</h2>
                    <div class="nutrition-grid">
                        <div class="nutrition-item">
                            <div class="nutrition-value">${recipe.nutritionalInfo.calories}</div>
                            <div class="nutrition-label">Calories</div>
                        </div>
                        <div class="nutrition-item">
                            <div class="nutrition-value">${recipe.nutritionalInfo.protein}g</div>
                            <div class="nutrition-label">Protein</div>
                        </div>
                        <div class="nutrition-item">
                            <div class="nutrition-value">${recipe.nutritionalInfo.carbs}g</div>
                            <div class="nutrition-label">Carbs</div>
                        </div>
                        <div class="nutrition-item">
                            <div class="nutrition-value">${recipe.nutritionalInfo.fat}g</div>
                            <div class="nutrition-label">Fat</div>
                        </div>
                        <div class="nutrition-item">
                            <div class="nutrition-value">${recipe.nutritionalInfo.fiber}g</div>
                            <div class="nutrition-label">Fiber</div>
                        </div>
                        <div class="nutrition-item">
                            <div class="nutrition-value">${recipe.nutritionalInfo.sugar}g</div>
                            <div class="nutrition-label">Sugar</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insert the HTML
    recipeDetail.innerHTML = recipeHTML;
    
    // Add event listeners for serving adjustment
    document.getElementById('decrease-serving').addEventListener('click', () => adjustServings(-1));
    document.getElementById('increase-serving').addEventListener('click', () => adjustServings(1));
}

// Adjust recipe servings
function adjustServings(change) {
    const servingDisplay = document.getElementById('serving-count');
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get('id'));
    const recipe = recipeDetails[recipeId];
    
    if (!recipe) return;
    
    // Calculate new servings (min 1, max 12)
    currentServings = Math.max(1, Math.min(12, currentServings + change));
    
    // Update display
    servingDisplay.textContent = currentServings;
    
    // For a real app, this would also adjust ingredient quantities
    // Here we just show an alert
    alert(`Servings adjusted to ${currentServings}. In a full application, ingredient quantities would be recalculated.`);
}

// Load related recipes
function loadRelatedRecipes(currentRecipeId) {
    // In a real app, this would fetch related recipes based on tags, cuisine, etc.
    // For demo, we'll use sample recipes from app.js but exclude current recipe
    
    // Get sample recipes from global scope
    let related = [];
    
    // Find related recipes by cuisine or dietary restrictions
    const currentRecipe = recipeDetails[currentRecipeId];
    if (currentRecipe) {
        // Use the ids from the sampleRecipes array to find related recipes
        for (let id in recipeDetails) {
            if (id != currentRecipeId) {
                const recipe = recipeDetails[id];
                // Match by cuisine or dietary restrictions
                if (recipe.cuisine === currentRecipe.cuisine || 
                    recipe.dietaryRestrictions.some(diet => 
                        currentRecipe.dietaryRestrictions.includes(diet))) {
                    related.push(recipe);
                }
                if (related.length >= 3) break; // Limit to 3 related recipes
            }
        }
    }
    
    if (related.length === 0) {
        relatedRecipes.innerHTML = '<p>No related recipes found.</p>';
        return;
    }
    
    let recipesHTML = '';
    
    related.forEach(recipe => {
        const dietTags = recipe.dietaryRestrictions.map(diet => 
            `<span class="recipe-tag">${diet}</span>`
        ).join('');
        
        recipesHTML += `
            <div class="recipe-card">
                <div class="recipe-image">
                    <img src="${recipe.image}" alt="${recipe.title}">
                </div>
                <div class="recipe-content">
                    <h3>${recipe.title}</h3>
                    <div class="recipe-meta">
                        <span>${recipe.time} mins</span>
                        <span>${recipe.difficulty}</span>
                    </div>
                    <div class="recipe-tags">
                        ${dietTags}
                    </div>
                    <a href="recipe-detail.html?id=${recipe.id}" class="view-recipe">View Recipe</a>
                </div>
            </div>
        `;
    });
    
    relatedRecipes.innerHTML = recipesHTML;
}

// Save recipe to user favorites
function saveRecipe() {
    // In a real app, this would save to user account or local storage
    alert('Recipe saved to your favorites!');
}

// Share recipe
function shareRecipe() {
    // In a real app, this would open share options for social media, email, etc.
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        }).then(() => {
            console.log('Thanks for sharing!');
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        alert(`Share this recipe: ${window.location.href}`);
    }
}

// Print recipe
function printRecipe() {
    window.print();
}
